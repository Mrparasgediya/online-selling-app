import mongoose, { HydratedDocument } from "mongoose";

interface IImage {
  src: Buffer | string;
  blur: Buffer | string;
  productId: mongoose.Schema.Types.ObjectId;
}

export default IImage;
export type ImageDocument = HydratedDocument<IImage>;
