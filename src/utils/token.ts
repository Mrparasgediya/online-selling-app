import jwt from "jsonwebtoken";
import { hashSync } from "bcrypt";

export const generateToken = (userId: string) =>
  jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: "8h" });

export const hashTokenForClient = (token: string): string => {
  let hashedToken: string = token;
  for (let currentSaltRound = 10; currentSaltRound < 13; currentSaltRound++)
    hashedToken = hashSync(hashedToken, currentSaltRound);
  return hashedToken;
};
