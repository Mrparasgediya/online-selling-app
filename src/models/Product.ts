import mongoose from "mongoose";
import IProduct, { ProductDocument } from "types/IProduct";
import { ImageDocument } from "types/IImage";
import Image from "./Image";

const productSchema: mongoose.Schema<IProduct> = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      validate: {
        validator: (nameToValidate) => !!nameToValidate.trim().length,
        message: () => "Enter Product valid name",
      },
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price must be greater then 0"],
    },

    description: {
      type: String,
      required: [true, "Enter Product description"],
      validate: {
        validator: (descriptionToValidate) =>
          descriptionToValidate.trim().length,
        message: "Enter valid product description",
      },
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
  },
  { timestamps: true }
);

productSchema.pre("remove", async function () {
  const product: ProductDocument & any = this;
  if (product.images && product.images.length) {
    for (let image of product.images) {
      const foundImage: ImageDocument = await Image.findById(
        image._id.toString()
      );
      if (foundImage) {
        await foundImage.remove();
      } else {
        const foundIndex = product.images.findIndex(
          (image) => image._id.toString() === image._id.toString()
        );
        if (foundIndex !== -1) {
          product.images.splice(foundIndex, 1);
        }
      }
    }
  }
});

const Product: mongoose.Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
