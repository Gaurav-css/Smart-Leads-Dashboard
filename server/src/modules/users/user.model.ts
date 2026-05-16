import { HydratedDocument, Schema, model } from "mongoose";
import { USER_ROLES, UserRole } from "./user.types";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "sales",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<IUser>("User", userSchema);

