import { NextApiHandler, NextApiResponse } from "next";
import multer from "multer";
import Product from "models/Product";
import authMiddleware from "middlewares/auth.middleware";
import adminMiddleware from "middlewares/admin.middleware";
import { NextApiAuthFileRequest } from "types/NextApiAuthFileRequest";
import { runMiddleware } from "utils/middleware";
import { connectDB, disconnectDB } from "utils/db";
import { setApiErrorMessage } from "utils/error";
import Image from "models/Image";
import { ImageDocument } from "types/IImage";
import sharp from "sharp";

const getImage: NextApiHandler = async (req, res) => {
  try {
    await connectDB();
    const foundImage = await Image.findById(req.query.imageId);
    await disconnectDB();
    if (!foundImage) throw { code: 404, message: "Image not found" };
    return res.send(foundImage);
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};

const deleteProductImage: NextApiHandler = async (req, res) => {
  try {
    const { productId, imageId } = req.query;
    await runMiddleware(req, res, authMiddleware);
    await runMiddleware(req, res, adminMiddleware);

    await connectDB();
    const foundProduct = await Product.findById(productId);
    if (!foundProduct) {
      await disconnectDB();
      throw { code: 404, message: "Product not found!" };
    }

    const foundImage = await Image.findById(imageId);
    if (!foundImage) {
      await disconnectDB();
      throw { code: 404, message: "Product Image not found!" };
    }
    await foundImage.remove();
    await disconnectDB();

    return res.send({ message: "Product image is deleted" });
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const updateProductImage = async (
  req: NextApiAuthFileRequest,
  res: NextApiResponse
) => {
  try {
    const { productId, imageId } = req.query;
    await runMiddleware(req, res, authMiddleware);
    await runMiddleware(req, res, adminMiddleware);
    await runMiddleware(req, res, multer({}).single("image"));
    if (!req.file || !req.file.buffer) throw new Error("Enter product image!");

    await connectDB();
    const foundProduct = await Product.findById(productId);
    if (!foundProduct) {
      await disconnectDB();
      throw { code: 404, message: "Product not found!" };
    }
    const foundProductImageIndex = foundProduct.images.findIndex(
      (currentImage) => currentImage.toString() === (imageId as string)
    );
    if (foundProductImageIndex === -1) {
      await disconnectDB();
      throw { code: 404, message: "Product Image not found!" };
    }
    // check file extension is same or not
    const foundImage: ImageDocument = await Image.findById(imageId);
    if (!foundImage) {
      await disconnectDB();
      throw { code: 404, message: "Product Image not found!" };
    }

    foundImage.src = await sharp(req.file.buffer).resize(350, 400).toBuffer();
    foundImage.blur = await sharp(req.file.buffer).resize(20, 20).toBuffer();
    await foundImage.save();
    await disconnectDB();
    return res.send({ message: "Product image updated!" });
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};

const productImageHandler = (
  req: NextApiAuthFileRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case "GET":
      return getImage(req, res);
    case "DELETE":
      return deleteProductImage(req, res);
    case "PUT":
      return updateProductImage(req, res);
    default:
      return res
        .status(405)
        .send({ error: `Method ${req.method} is not Allowed!` });
  }
};

export default productImageHandler;
