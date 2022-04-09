import { NextApiHandler, NextApiResponse } from "next";
import Product from "models/Product";
import authMiddleware from "middlewares/auth.middleware";
import adminMiddleware from "middlewares/admin.middleware";
import { NextApiAuthRequest } from "types/NextApiAuthRequest";
import { connectDB, disconnectDB } from "utils/db";
import { checkIsValidPayload, setDataToObj } from "utils/utils";
import { runMiddleware } from "utils/middleware";
import { setApiErrorMessage } from "utils/error";
import Image from "models/Image";

const getProduct: NextApiHandler = async (req, res) => {
  try {
    await connectDB();
    const foundProduct = await Product.find({
      _id: req.query.productId,
    }).populate({ path: "images", model: Image });
    await disconnectDB();
    if (!foundProduct) {
      throw { code: 404, message: "Product not found!" };
    }
    return res.send(foundProduct[0]);
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};

const updateProduct = async (req: NextApiAuthRequest, res: NextApiResponse) => {
  try {
    const validKeys = ["name", "price", "description"];

    await runMiddleware(req, res, authMiddleware);
    await runMiddleware(req, res, adminMiddleware);
    // check payload data
    const isValidPayload = checkIsValidPayload(
      Object.keys(req.body),
      validKeys,
      false
    );
    if (!isValidPayload) throw new Error("Enter valid data");
    // find product
    await connectDB();
    const foundProduct = await Product.findById(req.query.productId);
    if (!foundProduct) {
      await disconnectDB();
      throw { code: 404, message: "Product not found!" };
    }
    // update product
    setDataToObj(foundProduct, req.body, validKeys);
    await foundProduct.save();
    await disconnectDB();

    return res.send({
      message: "Product Updated Successfully",
      updatedProduct: foundProduct,
    });
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};

const deleteProduct = async (req: NextApiAuthRequest, res: NextApiResponse) => {
  try {
    await runMiddleware(req, res, authMiddleware);
    await runMiddleware(req, res, adminMiddleware);
    await connectDB();
    const foundProduct = await Product.findById(req.query.productId);

    if (!foundProduct) {
      await disconnectDB();
      throw { code: 404, message: "Product not found!" };
    }

    await foundProduct.remove();
    await disconnectDB();

    return res.send({ message: "Product deleted successfully" });
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};

const productHandler = (req: NextApiAuthRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getProduct(req, res);
    case "PUT":
      return updateProduct(req, res);
    case "DELETE":
      return deleteProduct(req, res);
    default:
      return res
        .status(405)
        .send({ error: `Method ${req.method} is not Allowed!` });
  }
};

export default productHandler;
