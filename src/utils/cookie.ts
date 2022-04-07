import { NextApiResponse } from "next";

export const cookieOptions = {
  httpOnly: true,
  "Max-Age": 28800,
  path: "/",
  sameSite: "Strict",
  secure: process.env.NODE_ENV === "production",
};

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: string,
  options: object
) => {
  let cookieStr: string = `${name}=${
    typeof value === "object" ? JSON.stringify(value) : value
  }; `;

  for (let key of Object.keys(options))
    if (key !== "secure") cookieStr += `${key}=${options[key]}; `;

  if (process.env.NODE_ENV === "production") {
    cookieStr += "Secure;";
  }
  res.setHeader("Set-Cookie", cookieStr);
};

export const clearCookie = (res: NextApiResponse, name: string) =>
  setCookie(res, name, "0", { ...cookieOptions, path: "/", "Max-Age": 1 });
