import { UserDocument } from "./IUser";
import { NextApiRequest } from "next/types";

export type NextApiAuthRequest = { user: UserDocument } & NextApiRequest;
