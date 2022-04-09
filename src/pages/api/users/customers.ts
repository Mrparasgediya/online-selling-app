import adminMiddleware from "middlewares/admin.middleware";
import authMiddleware from "middlewares/auth.middleware";
import User from "models/User";
import { NextApiResponse } from "next";
import { NextApiAuthRequest } from "types/NextApiAuthRequest";
import { connectDB, disconnectDB } from "utils/db";
import { setApiErrorMessage } from "utils/error";
import { runMiddleware } from "utils/middleware";

const getAllCustomerCount = async (
  req: NextApiAuthRequest,
  res: NextApiResponse
) => {
  try {
    await runMiddleware(req, res, authMiddleware);
    await runMiddleware(req, res, adminMiddleware);
    await connectDB();
    const customersCount = await User.find({ role: "customer" }).count().exec();
    await disconnectDB();
    return res.send({ customersCount });
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};

const deleteAllCustomers = async (
  req: NextApiAuthRequest,
  res: NextApiResponse
) => {
  try {
    await runMiddleware(req, res, authMiddleware);
    await runMiddleware(req, res, adminMiddleware);
    await connectDB();
    await User.deleteMany({ role: "customer" });
    await disconnectDB();
    return res.send({ message: "HEllo world" });
  } catch (error) {
    return setApiErrorMessage(res, error);
  }
};

const customersUserseHandler = (
  req: NextApiAuthRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case "GET":
      return getAllCustomerCount(req, res);
    case "DELETE":
      return deleteAllCustomers(req, res);
    default:
      return res
        .status(405)
        .send({ error: `Method ${req.method} is not Allowed!` });
  }
};

export default customersUserseHandler;
