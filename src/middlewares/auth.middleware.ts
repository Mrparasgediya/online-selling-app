import User from "models/User";
import { NextApiHandler, NextApiResponse } from "next";
import { UserDocument } from "types/IUser";
import { NextApiAuthRequest } from "types/NextApiAuthRequest";
import { connectDB, disconnectDB } from "utils/db";
import jwt from "jsonwebtoken";

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
    return res.status(error.code || 400).send({
      error: !error.errors
        ? error.message
        : error.errors[Object.keys(error.errors)[0]].properties.message,
    });
  }
};

export default authMiddleware;
