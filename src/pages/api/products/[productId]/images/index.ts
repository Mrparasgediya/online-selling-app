import { NextApiResponse } from "next";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import Product from "models/Product";
import authMiddleware from "middlewares/auth.middleware";
import adminMiddleware from "middlewares/admin.middleware";
import { NextApiAuthFileRequest } from "types/NextApiAuthFileRequest";
import { runMiddleware } from "utils/middleware";
import { connectDB, disconnectDB } from "utils/db";
import { setApiErrorMessage } from "utils/error";

const upload = multer({});

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadProductImage = async (
  req: NextApiAuthFileRequest,
  res: NextApiResponse
) => {
  try {
    const productId = req.query.productId;
    await runMiddleware(req, res, authMiddleware);
    await runMiddleware(req, res, adminMiddleware);
    await runMiddleware(req, res, upload.single("image"));
    await connectDB();
    const foundProduct = await Product.findById(productId as string);

    if (!foundProduct) {
      await disconnectDB();
      throw { code: 404, message: "Product not found!" };
    }

    const fileExtension = req.file.originalname.split(".").slice(-1);
    const newFileName = `${productId}-${foundProduct.nextImageId}.${fileExtension}`;
    foundProduct.images.push(newFileName);
    foundProduct.nextImageId++;
    await fs.writeFile(
      path.join(".", "public", "uploads", "products", newFileName),
      req.file.buffer
    );
    await foundProduct.save();
    await disconnectDB();
    return res.send(foundProduct);
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};

const productImagesHandler = async (
  req: NextApiAuthFileRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case "POST":
      return uploadProductImage(req, res);
    default:
      return res
        .status(405)
        .send({ error: `Method ${req.method} is not Allowed!` });
  }
};

export default productImagesHandler;
