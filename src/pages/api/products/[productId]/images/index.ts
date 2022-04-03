import { NextApiRequest, NextApiResponse } from "next";
import multer from 'multer'
import { runMiddleware } from "utils/middleware";
import { connectDB, disconnectDB } from "utils/db";
import Product from "models/Product";
import fs from 'fs/promises';
import path from 'path';

const upload = multer({});

type NextApiRequestWithFile = NextApiRequest & { [key: string]: any };

export const config = {
    api: {
        bodyParser: false
    }
}

const uploadProductImage = async (req: NextApiRequestWithFile, res: NextApiResponse) => {
    try {
        const productId = req.query.productId;
        await runMiddleware(req, res, upload.single('image'));
        await connectDB();
        const foundProduct = await Product.findById(productId);
        if (!foundProduct) {
            await disconnectDB();
            throw { code: 404, message: "Product not found!" };
        }

        const fileExtension = req.file.originalname.split('.').slice(-1);
        const newFileName = `${productId}-${foundProduct.nextImageId}.${fileExtension}`;
        foundProduct.images.push(newFileName);
        foundProduct.nextImageId++;
        await fs.writeFile(path.join('.', 'public', 'uploads', 'products', newFileName), req.file.buffer);
        await foundProduct.save();
        await disconnectDB();
        return res.send(foundProduct);
    } catch (error) {
        return res.status(error.code || 400).send({ error: error.message });
    }
}

const productImageHandler = async (req: NextApiRequestWithFile, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            return uploadProductImage(req, res);
        default:
            return res.status(405).send({ error: `Method ${req.method} is not Allowed!` });
    }
}

export default productImageHandler;