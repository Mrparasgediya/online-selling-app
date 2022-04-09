import mongoose from "mongoose";
import images from "pages/admin/products/[productId]/images";
import IImage, { ImageDocument } from "types/IImage";
import { convertImageBufferToBase64Url } from "utils/image";
import Product from "./Product";

const imageSchema = new mongoose.Schema<IImage>(
  {
    src: {
      type: Buffer,
      required: [true, "Enter image source"],
    },
    blur: {
      type: Buffer,
      required: [true, "Enter image source"],
    },
    productId: {
      ref: "Product",
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Enter product id"],
    },
  },
  { timestamps: true }
);

imageSchema.methods.toJSON = function () {
  let image: ImageDocument = this.toObject();
  image.blur = convertImageBufferToBase64Url(image.blur as Buffer);
  image.src = convertImageBufferToBase64Url(image.src as Buffer);
  return image;
};

imageSchema.pre("save", async function () {
  const image = this;
  const foundProduct = await Product.findById(image.productId);
  if (!foundProduct) throw new Error("Product not found");
  const foundImageIndex = foundProduct.images.findIndex(
    (imageId) => imageId.toString() === image._id.toString()
  );
  if (foundImageIndex === -1) {
    foundProduct.images.push(image._id);
    await foundProduct.save();
  }
});

imageSchema.pre("remove", async function () {
  const image = this;
  const foundProduct = await Product.findById(image.productId);
  if (!foundProduct) throw { code: 404, message: "Product not found!" };
  const foundIndex = foundProduct.images.findIndex(
    (id) => id.toString() === image._id.toString()
  );
  if (foundIndex === -1)
    throw { code: 404, message: "Product Image not found!" };
  foundProduct.images.splice(foundIndex, 1);
  await foundProduct.save();
});

const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);

export default Image;
