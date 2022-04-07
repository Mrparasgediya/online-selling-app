import { NextApiHandler, NextApiResponse } from "next";
import { NextApiAuthRequest } from "types/NextApiAuthRequest";
import { getErrorMessage } from "utils/error";

const adminMiddleware = (
  req: NextApiAuthRequest,
  res: NextApiResponse,
  next: NextApiHandler
) => {
  try {
    if (req.user.role !== "admin")
      throw new Error("You don't have permission!");
    return next(req, res);
  } catch (error) {
    return res.status(403).send({ error: getErrorMessage(error) });
  }
};
export default adminMiddleware;
