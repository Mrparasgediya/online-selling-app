import cookie from "js-cookie";

export const cookieOptions = {
  httpOnly: true,
  "Max-Age": 28800,
  path: "/",
  sameSite: "Strict",
  secure: process.env.NODE_ENV === "production",
};

export const saveToken = (token: string) => {
  cookie.set("auth", token, {
    expires: 8 / 24,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
};

export const getToken = (): string | undefined => {
  return cookie.get("auth");
};

export const removeToken = () => {
  cookie.remove("auth");
};
