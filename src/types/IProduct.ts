import mongoose from "mongoose";
import { HydratedDocument } from "mongoose";
import IImage, { ImageDocument } from "./IImage";

export default interface IProduct {
  name: string;
  price: number;
  description: string;
  images: mongoose.Schema.Types.ObjectId[];
  nextImageId: number;
}

export type ProductDocument = HydratedDocument<
  Omit<IProduct, "images"> & { images: ImageDocument[] }
>;
