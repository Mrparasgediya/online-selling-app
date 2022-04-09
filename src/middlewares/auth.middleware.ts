import User from "models/User";
import { NextApiHandler, NextApiResponse } from "next";
import { UserDocument } from "types/IUser";
import { NextApiAuthRequest } from "types/NextApiAuthRequest";
import { connectDB, disconnectDB } from "utils/db";
import jwt from "jsonwebtoken";
import { setApiErrorMessage } from "utils/error";

const authMiddleware = async (
  req: NextApiAuthRequest,
  res: NextApiResponse,
  next: NextApiHandler
) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) throw { code: 403, message: "Enter token!" };
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();
    const foundUser: UserDocument = await User.findById(_id);
    await disconnectDB();
    if (!foundUser) throw { code: 404, message: "User not found!" };
    req.user = foundUser;
    return next(req, res);
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};

export default authMiddleware;
