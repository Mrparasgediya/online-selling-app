import { NextApiResponse } from "next";
import authMiddleware from "middlewares/auth.middleware";
import { NextApiAuthRequest } from "types/NextApiAuthRequest";
import { runMiddleware } from "utils/middleware";

const currentUserHandler = async (
  req: NextApiAuthRequest,
  res: NextApiResponse
) => {
  await runMiddleware(req, res, authMiddleware);
  return res.send({ user: req.user });
};

export default currentUserHandler;
