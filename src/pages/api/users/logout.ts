import { NextApiHandler } from "next";
import { clearCookie } from "utils/cookie";

const logout: NextApiHandler = (req, res) => {
  clearCookie(res, "auth");
  return res.send({});
};

const LogoutUserHandler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "POST":
      return logout(req, res);
    default:
      return res
        .status(405)
        .send({ error: `Method ${req.method} is not Allowed!` });
  }
};

export default LogoutUserHandler;
