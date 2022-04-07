import { UserDocument } from "types/IUser";

export const isAdminUser = (user: UserDocument) => user.role === "admin";
