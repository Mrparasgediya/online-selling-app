import { NextApiHandler, NextApiResponse } from "next";
import "types/IProduct";
import Product from 'models/Product';
import { connectDB, disconnectDB } from "utils/db";
import { checkIsValidPayload, setDataToObj } from "utils/utils";
import IProduct from "types/IProduct";

const createNewProduct: NextApiHandler = async (req, res) => {
  const validKeys: string[] = ['name', 'price', 'quantity', 'description'];
  let isValidOperation: boolean = checkIsValidPayload(Object.keys(req.body), validKeys);
  try {
    if (!isValidOperation)
      throw new Error("Enter valid data");
    const newProductData: IProduct = setDataToObj({}, req.body, validKeys);
    newProductData.nextImageId = 1;
    const newProduct = new Product(newProductData);
    await connectDB();
    await newProduct.save();
    await disconnectDB();
    return res.status(201).send(newProduct);
  } catch (error) {
    return res.status(400).send({ error: !error.errors ? error.message : error.errors[Object.keys(error.errors)[0]].properties.message });
  }
}

const getAllProducts: NextApiHandler = async (req, res) => {
  try {
    await connectDB();
    const products = await Product.find({});
    await disconnectDB();
    return res.send({ products });
  } catch (error) {
    return res.status(400).send({
      error: error.message
    });
  }
}

const productsHandler: NextApiHandler = (req, res) => {
  switch (req.method) {
    case "GET":
      return getAllProducts(req, res);
    case "POST":
      return createNewProduct(req, res);
    default:
      return res.status(405).send({ error: `Method ${req.method} is not Allowed!` });
  }
}

export default productsHandler;