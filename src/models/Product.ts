import mongoose from "mongoose";
import IProduct from "types/IProduct";

const productSchema: mongoose.Schema<IProduct> = new mongoose.Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            validate:
            {
                validator: (nameToValidate) => !!nameToValidate.trim().length,
                message: () => "Enter Product valid name"
            }
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Product price must be greater then 0']
        },
        quantity: {
            type: Number,
            required: [true, 'Product quantity is required'],
            min: [0, 'Enter valid product quantity']
        },
        description: {
            type: String,
            required: [true, 'Enter Product description'],
            validate: {
                validator: descriptionToValidate => descriptionToValidate.trim().length,
                message: "Enter valid product description"
            }
        },
        nextImageId: { type: Number, defualt: 1 },
        images: [{ type: String, required: [true, 'Enter Product image file'] }]
    },
    { timestamps: true }
);

const Person: mongoose.Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Person;