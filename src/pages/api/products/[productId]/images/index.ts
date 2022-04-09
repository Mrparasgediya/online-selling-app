import { NextApiResponse } from "next";
import multer from "multer";
import Product from "models/Product";
import authMiddleware from "middlewares/auth.middleware";
import adminMiddleware from "middlewares/admin.middleware";
import { NextApiAuthFileRequest } from "types/NextApiAuthFileRequest";
import { runMiddleware } from "utils/middleware";
import { connectDB, disconnectDB } from "utils/db";
import { setApiErrorMessage } from "utils/error";
import sharp from "sharp";
import { ImageDocument } from "types/IImage";
import Image from "models/Image";

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
    if (!req.file || !req.file.buffer)
      throw new Error("Enter product image file");

    const newImage: ImageDocument = new Image({
      src: await sharp(req.file.buffer).resize(350, 400).toBuffer(),
      blur: await sharp(req.file.buffer).resize(20, 20).toBuffer(),
      productId: req.query.productId,
    });

    await connectDB();
    await newImage.save();
    await disconnectDB();

    return res.send({ image: newImage });
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
