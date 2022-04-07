import { NextApiAuthRequest } from "./NextApiAuthRequest";

export type NextApiAuthFileRequest = NextApiAuthRequest & {
  file: any;
};
