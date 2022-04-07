import mongoose from "mongoose";
import IUser, { UserDocument } from "types/IUser";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Enter username"],
      unique: true,
      validate: {
        validator: (usernameToValidate: string) =>
          !!usernameToValidate.trim().length,
        message: () => "Enter valid username",
      },
    },
    password: {
      type: String,
      required: [true, "Enter Password"],
      validate: {
        validator: (passwordToValidate: string) =>
          !!passwordToValidate.trim().length,
        message: "Enter valid password",
      },
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
      required: [true, "Enter user role"],
      validate: {
        validator: (roleToCheck) =>
          !!roleToCheck.trim().length &&
          (roleToCheck === "admin" || roleToCheck === "customer"),
        message: "Enter valid user role",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  const user: UserDocument = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

const User: mongoose.Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
