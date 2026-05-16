import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../utils/app-error";
import { UserModel } from "../users/user.model";
import { AuthUser, UserRole } from "../users/user.types";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  adminKey?: string | undefined;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

const buildToken = (user: AuthUser): string => {
  return jwt.sign(user, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

const sanitizeUser = (user: { id: string; name: string; email: string; role: UserRole }) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const registerUser = async (payload: RegisterPayload): Promise<AuthResult> => {
  const existingUser = await UserModel.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(409, "User already exists with this email");
  }

  if (payload.role === "admin") {
    if (!env.ADMIN_REGISTRATION_KEY) {
      throw new AppError(403, "Admin registration is not enabled");
    }
    if (payload.adminKey !== env.ADMIN_REGISTRATION_KEY) {
      throw new AppError(403, "Invalid admin registration key");
    }
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);

  const createdUser = await UserModel.create({
    name: payload.name,
    email: payload.email,
    passwordHash,
    role: payload.role,
  });

  const authUser: AuthUser = {
    userId: createdUser.id,
    role: createdUser.role,
    email: createdUser.email,
  };

  const token = buildToken(authUser);

  return {
    token,
    user: sanitizeUser({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
    }),
  };
};

export const loginUser = async (payload: LoginPayload): Promise<AuthResult> => {
  const user = await UserModel.findOne({ email: payload.email });
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const authUser: AuthUser = {
    userId: user.id,
    role: user.role,
    email: user.email,
  };

  const token = buildToken(authUser);

  return {
    token,
    user: sanitizeUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }),
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await UserModel.findById(userId).select("_id name email role");
  if (!user) {
    throw new AppError(404, "User not found");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};
