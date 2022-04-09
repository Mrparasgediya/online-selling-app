import { NextApiRequest, NextApiResponse } from "next";
import Product from "models/Product";
import authMiddleware from "middlewares/auth.middleware";
import adminMiddleware from "middlewares/admin.middleware";
import IProduct from "types/IProduct";
import { NextApiAuthRequest } from "types/NextApiAuthRequest";
import { connectDB, disconnectDB } from "utils/db";
import { checkIsValidPayload, setDataToObj } from "utils/utils";
import { runMiddleware } from "utils/middleware";
import { setApiErrorMessage } from "utils/error";
import Image from "models/Image";

const createNewProduct = async (
  req: NextApiAuthRequest,
  res: NextApiResponse
) => {
  try {
    await runMiddleware(req, res, authMiddleware);
    await runMiddleware(req, res, adminMiddleware);

    const validKeys: string[] = ["name", "price", "description"];
    let isValidOperation: boolean = checkIsValidPayload(
      Object.keys(req.body),
      validKeys
    );
    if (!isValidOperation) throw new Error("Enter valid data");
    const newProductData: IProduct = setDataToObj({}, req.body, validKeys);
    const newProduct = new Product(newProductData);
    await connectDB();
    await newProduct.save();
    await disconnectDB();
    return res.status(201).send(newProduct);
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};

const getAllProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    const products = await Product.find({}).populate({
      path: "images",
      model: Image,
    });
    await disconnectDB();
    return res.send({ products });
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};

const allProductsHandler = (req: NextApiAuthRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getAllProducts(req, res);
    case "POST":
      return createNewProduct(req, res);
    default:
      return res
        .status(405)
        .send({ error: `Method ${req.method} is not Allowed!` });
  }
};

export default allProductsHandler;
