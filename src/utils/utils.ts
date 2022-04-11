import { AxiosResponse } from "axios";
import API from "config/axios";
import { GetServerSidePropsContext } from "next";
import { UserContextDetails, UserDocument } from "types/IUser";
import { isAdminUser } from "./user";

export function checkIsValidPayload(
  keysToCheck: string[],
  validKeys: string[],
  checkAllKeys: boolean = true
) {
  return !checkAllKeys
    ? validKeys.some((key) => keysToCheck.includes(key))
    : validKeys.every((key) => keysToCheck.includes(key));
}
export function setDataToObj(obj: any, body: any, validKeys: string[]) {
  for (let key of validKeys) {
    if (body[key]) obj[key] = body[key];
  }
  return obj;
}

export const getUserFromToken = async (
  token: string
): Promise<UserDocument> => {
  if (!token) throw new Error("Token not found!");

  const {
    data: { user },
  }: AxiosResponse<{ user: UserDocument }> = await API.get(
    "/api/users/current",
    {
      headers: { Authorization: `Barear ${token}` },
    }
  );

  return user;
};

export const getUserDetailsFromContext = async (
  ctx: GetServerSidePropsContext
): Promise<UserContextDetails> => {
  const { auth } = ctx.req.cookies;
  if (!auth) return [null, false, auth];
  const user = await getUserFromToken(auth);
  return [user || null, isAdminUser(user), auth || null];
};
