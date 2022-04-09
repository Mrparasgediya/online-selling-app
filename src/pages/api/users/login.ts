import { NextApiHandler } from "next";
import bcrypt from "bcrypt";
import User from "models/User";
import { UserDocument } from "types/IUser";
import { connectDB, disconnectDB } from "utils/db";
import { checkIsValidPayload } from "utils/utils";
import { generateToken } from "utils/token";
import { setApiErrorMessage } from "utils/error";

const loginUser: NextApiHandler = async (req, res) => {
  try {
    const validKeys = ["username", "password"];
    const isValidOperation = checkIsValidPayload(
      Object.keys(req.body),
      validKeys
    );
    if (!isValidOperation) throw new Error("Enter valid data!");
    const { username, password } = req.body;
    await connectDB();
    const foundUser: UserDocument = await User.findOne({ username });
    await disconnectDB();
    if (!foundUser) {
      throw { code: 404, message: "User not found!" };
    }
    if (!(await bcrypt.compare(password, foundUser.password))) {
      throw new Error("Password Doesn't matched!");
    }

    return res.send({
      token: await generateToken(foundUser._id.toString()),
      user: foundUser,
    });
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};
const loginUserHandler: NextApiHandler = (req, res) => {
  switch (req.method) {
    case "POST":
      return loginUser(req, res);
    default:
      return res
        .status(405)
        .send({ error: `Method ${req.method} is not Allowed!` });
  }
};

export default loginUserHandler;
