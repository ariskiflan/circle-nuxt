import type { IProfile } from "~/types/app";
import { db } from "../db";

export const getProfile = async (userId: number) => {
  return await db.profile.findFirst({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          username: true,
          fullname: true,
          id: true,
          thread: {
            select: {
              content: true,
              image: true,
              id: true,
            },
          },
          following: {
            select: {
              followingId: true,
            },
          },
          follower: {
            select: {
              followerId: true,
              followingId: true,
            },
          },
        },
      },
    },
  });
};

// server/utils/profile.service.ts
export const updateProfileService = async (userId: number, payload: IProfile) => {
  const dataToUpdate: Partial<IProfile> = {};

  // Menggunakan pengecekan yang lebih ringkas
  if (payload.bio != null) dataToUpdate.bio = payload.bio;
  if (payload.avatar != null) dataToUpdate.avatar = payload.avatar;
  if (payload.cover != null) dataToUpdate.cover = payload.cover;

  // Update tabel User jika username/fullname berubah
  if (payload.username != null) {
    await db.user.update({
      where: { id: userId },
      data: { username: payload.username },
    });
  }

  if (payload.fullname != null) {
    await db.user.update({
      where: { id: userId },
      data: { fullname: payload.fullname },
    });
  }

  // Update tabel Profile
  return await db.profile.update({
    where: { userId: userId },
    data: dataToUpdate,
  });
};