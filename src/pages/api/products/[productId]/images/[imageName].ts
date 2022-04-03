import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import Product from 'models/Product';
import { connectDB, disconnectDB } from "utils/db";
import fs from 'fs/promises';
import path from 'path';
import { runMiddleware } from "utils/middleware";
import multer from 'multer'
import { isFileExists } from "utils/file.";

type NextApiRequestWithFile = NextApiRequest & { [key: string]: any };


const deleteProductImage: NextApiHandler = async (req, res) => {
    try {
        const { productId, imageName } = req.query;
        await connectDB();
        const foundProduct = await Product.findById(productId);
        if (!foundProduct) {
            await disconnectDB();
            throw { code: 404, message: "Product not found!" };
        }
        const foundProductImageidx = foundProduct.images.findIndex(currentImage => currentImage === imageName);
        if (foundProductImageidx === -1) {
            await disconnectDB();
            throw { code: 404, message: "Product Image not found!" };
        }
        await fs.unlink(path.join('.', 'public', 'uploads', 'products', imageName as string));
        foundProduct.images.splice(foundProductImageidx, 1);
        await foundProduct.save();
        await disconnectDB();
        return res.send({ message: "Product image is deleted" });
    } catch (error) {
        return res.status(error.code || 400).send({ error: error.message });
    }
}

export const config = {
    api: {
        bodyParser: false
    }
}

const updateProductImage = async (req: NextApiRequestWithFile, res: NextApiResponse) => {
    try {
        await runMiddleware(req, res, multer({}).single('image'));
        const { productId, imageName } = req.query;
        await connectDB();
        const foundProduct = await Product.findById(productId);
        if (!foundProduct) {
            await disconnectDB();
            throw { code: 404, message: "Product not found!" }
        }
        const foundProductImageidx = foundProduct.images.findIndex(currentImage => currentImage === imageName);
        if (foundProductImageidx === -1) {
            await disconnectDB();
            throw { code: 404, message: "Product Image not found!" };
        }
        // check file extension is same or not 
        const fileExtension = req.file.originalname.split('.').slice(-1)[0];
        const baseUploadUrl = path.join('.', 'public', 'uploads', 'products');
        if (`.${fileExtension}` === path.extname(path.join(baseUploadUrl, imageName as string))) {
            await fs.writeFile(path.join(baseUploadUrl, imageName as string), req.file.buffer);
        } else {
            // change file name
            const newFileName = `${(imageName as string).split('.')[0]}.${fileExtension}`;
            // save new file
            await fs.writeFile(path.join(baseUploadUrl, newFileName), req.file.buffer);
            // remove old file
            if (await isFileExists(path.join(baseUploadUrl, imageName as string))) {
                await fs.unlink(path.join(baseUploadUrl, imageName as string));
            }
            // change new file name in arr
            foundProduct.images[foundProductImageidx] = newFileName;
            await foundProduct.save();
        }
        // remove file if file extension is not same
        await disconnectDB();
        return res.send({ message: "Product image updated!" });
    } catch (error) {
        return res.status(error.code || 400).send({ error: error.message });
    }
}

const productImageHandler: NextApiHandler = (req, res) => {
    switch (req.method) {
        case 'DELETE':
            return deleteProductImage(req, res);
        case 'PUT':
            return updateProductImage(req, res);
        default:
            return res.status(405).send({ error: `Method ${req.method} is not Allowed!` });
    }
}

export default productImageHandler;