import{db} from "../db";

export const getLikes = async (threadId: number) => {
  return await db.like.findMany({
    where: {
      threadId,
    },
    include: {
      user: {
        select: {
          username: true,
          fullname: true,
          id: true,
          profile: {
            select: {
              avatar: true,
            },
          },
        },
      },
    },
  });
};

export const getCurrentLike = async (threadId: number, userId: number) => {
  return await db.like.findFirst({
    where: {
      threadId,
      userId,
    },
  });
};

export const createLike = async (threadId: number, userId: number) => {
  const existedThread = await db.thread.findFirst({
    where: {
      id: threadId,
    },
  });

  if (!existedThread) {
    throw new Error("Thread not found");
  }

  const existedLike = await db.like.findFirst({
    where: { threadId, userId },
  });

  if (existedLike) {
    await db.like.deleteMany({
      where: { threadId, userId },
    });
    // Kembalikan status 'unliked'
    return { action: 'unliked', data: null };
  }

  const newLike = await db.like.create({
    data: { threadId, userId },
  });
  
  // Kembalikan status 'liked'
  return { action: 'liked', data: newLike };
};
