import { NextApiResponse } from "next";
import User from "models/User";
import authMiddleware from "middlewares/auth.middleware";
import { UserDocument } from "types/IUser";
import { NextApiAuthRequest } from "types/NextApiAuthRequest";
import { connectDB, disconnectDB } from "utils/db";
import { setApiErrorMessage } from "utils/error";
import { runMiddleware } from "utils/middleware";
import { checkIsValidPayload, setDataToObj } from "utils/utils";

const updateUser = async (req: NextApiAuthRequest, res: NextApiResponse) => {
  try {
    const validKeys: string[] = ["username", "password", "role"];

    await runMiddleware(req, res, authMiddleware);

    if (req.user._id.toString() !== req.query.userId)
      throw new Error("You are not allowed!");

    let isValidOperation: boolean = checkIsValidPayload(
      Object.keys(req.body),
      validKeys,
      false
    );
    if (!isValidOperation) throw new Error("Enter valid data");
    await connectDB();
    const foundUser: UserDocument = await User.findById(req.query.userId);
    if (!foundUser) {
      await disconnectDB();
      throw { code: 404, message: "User not found!" };
    }
    setDataToObj(foundUser, req.body, validKeys);
    await foundUser.save();
    await disconnectDB();
    return res.send({ user: foundUser });
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};
const deleteUser = async (req: NextApiAuthRequest, res: NextApiResponse) => {
  try {
    await runMiddleware(req, res, authMiddleware);

    if (req.user._id.toString() !== req.query.userId)
      throw new Error("You are not allowed!");

    await connectDB();
    const user: UserDocument = await User.findById(req.query.userId);
    if (!user) {
      await disconnectDB();
      throw { code: 404, message: "user not found" };
    }
    await user.remove();
    await disconnectDB();
    return res.send({ message: "user is removed" });
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};
const getUserById = async (req: NextApiAuthRequest, res: NextApiResponse) => {
  try {
    await runMiddleware(req, res, authMiddleware);

    if (req.user._id.toString() !== req.query.userId)
      throw new Error("You are not allowed!");

    await connectDB();
    const user: UserDocument = await User.findById(req.query.userId);
    if (!user) {
      await disconnectDB();
      throw { code: 404, message: "user not found" };
    }
    await disconnectDB();
    return res.send({ user });
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};

const userHandler = (req: NextApiAuthRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getUserById(req, res);
    case "PUT":
      return updateUser(req, res);
    case "DELETE":
      return deleteUser(req, res);
    default:
      return res
        .status(405)
        .send({ error: `Method ${req.method} is not Allowed!` });
  }
};

export default userHandler;
