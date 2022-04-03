import { NextApiHandler, NextApiRequest } from "next";
import Product from 'models/Product';
import { connectDB, disconnectDB } from "utils/db";
import { checkIsValidPayload, setDataToObj } from "utils/utils";

const getProduct: NextApiHandler = async (req, res) => {
    try {
        await connectDB();
        const foundProduct = await Product.findById(req.query.productId);
        await disconnectDB();
        if (!foundProduct) {
            throw { code: 404, message: "Product not found!" };
        }
        return res.send(foundProduct);
    } catch (error) {
        return res.status(error.code || 400).send({ error: error.message });
    }
}

const updateProduct: NextApiHandler = async (req, res) => {
    try {
        const validKeys = ['name', 'price', 'quantity', 'description'];
        // check payload data
        const isValidPayload = checkIsValidPayload(Object.keys(req.body), validKeys, false);
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

        return res.send({ message: "Product Updated Successfully", updatedProduct: foundProduct });
    } catch (error) {
        return res.status(error.code || 400).send({ error: error.message });
    }
}

const deleteProduct: NextApiHandler = async (req, res) => {
    try {
        await connectDB();
        const foundProduct = await Product.findById(req.query.productId);

        if (!foundProduct) {
            await disconnectDB();
            throw { code: 404, message: "Product not found!" };
        }

        await foundProduct.remove();
        await disconnectDB();

        return res.send({ message: "Proudct deleted successfully" })
    } catch (error) {
        return res.status(error.code || 400).send({ error: error.message });

    }
}

const productHandler: NextApiHandler = (req, res) => {
    switch (req.method) {
        case 'GET':
            return getProduct(req, res);
        case 'PUT':
            return updateProduct(req, res);
        case 'DELETE':
            return deleteProduct(req, res);
        default:
            return res.status(405).send({ error: `Method ${req.method} is not Allowed!` })
    }
}

export default productHandler;