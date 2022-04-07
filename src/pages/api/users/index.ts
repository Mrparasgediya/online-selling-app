import adminMiddleware from "middlewares/admin.middleware";
import authMiddleware from "middlewares/auth.middleware";
import User from "models/User";
import { NextApiHandler } from "next";
import { UserDocument } from "types/IUser";
import { connectDB, disconnectDB } from "utils/db";
import { setApiErrorMessage } from "utils/error";
import { runMiddleware } from "utils/middleware";
import { checkIsValidPayload } from "utils/utils";

const createNewUser: NextApiHandler = async (req, res) => {
  const validKeys: string[] = ["username", "password"];
  let isValidOperation: boolean = checkIsValidPayload(
    Object.keys(req.body),
    validKeys
  );
  try {
    if (!isValidOperation) throw new Error("Enter valid data");
    const { username, password } = req.body;
    const newUser: UserDocument = new User({ username, password });
    await connectDB();
    await newUser.save();
    await disconnectDB();
    return res.send({ user: newUser });
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};
const getAllUsers: NextApiHandler = async (req, res) => {
  try {
    await runMiddleware(req, res, authMiddleware);
    await runMiddleware(req, res, adminMiddleware);
    await connectDB();
    const users: UserDocument[] = await User.find({});
    await disconnectDB();
    return res.send({ users });
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};
const allUsersHandler: NextApiHandler = (req, res) => {
  switch (req.method) {
    case "GET":
      return getAllUsers(req, res);
    case "POST":
      return createNewUser(req, res);
    default:
      return res
        .status(405)
        .send({ error: `Method ${req.method} is not Allowed!` });
  }
};

export default allUsersHandler;
