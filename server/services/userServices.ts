// server/services/userServices.ts
import { db } from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerValidator } from "../validators/registerValidators";
import type { Iregister, Ilogin  } from "../../types/app"; // relative path aman


const JWT_SECRET = process.env.SECRET_KEY || 'rahasiaSuperSusahDitebak123!@#';

export const register = async (payload: Iregister) => {
  const { error, value } = registerValidator.validate(payload);
  if (error) throw new Error(error.details?.[0]?.message || "Validation error");

  const isExist = await db.user.findFirst({
    where: {
      OR: [
        { username: value.username },
        { email: value.email },
      ],
    },
  });

  if (isExist) throw new Error("Username or Email already exist");

  const hashedPassword = await bcrypt.hash(value.password, 10);
  value.password = hashedPassword;

  const user = await db.user.create({
    data: { ...value },
  });

  const profile = await db.profile.create({
    data: { userId: user.id },
  });

  return { user, profile };
};

export const login = async (payload: Ilogin) => {
  const { email, password } = payload;

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const { password: _, ...safeUser } = user;

  return { user: safeUser, token };
};

export const getUsers = async () => {
  return await db.user.findMany({
    select: {
      id: true,
      username: true,
      fullname: true,
      email: true,
    },
  });
};

export const getUser = async (id: number) => {
  return await db.user.findFirst({
    where: { id },
    select: {
      id: true,
      username: true,
      fullname: true,
      profile: {
        select: {
          avatar: true,
          cover: true,
          bio: true,
        },
      },
      follower: {
        select: {
          followerId: true,
        },
      },
      following: {
        select: {
          followingId: true,
        },
      },
    },
  })
}
