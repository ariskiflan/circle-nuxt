// import type { Ithread } from "~/types/app";
import { db } from "../db";


export const getThreads = async () => {
  return await db.thread.findMany({
    where: {
      threadId: null,
    },
    include: {
      image: {
        select: {
          image: true,
        },
      },
      author: {
        select: {
          id: true,
          username: true,
          fullname: true,
          email: true,
          profile: {
            select: {
              avatar: true,
            },
          },
        },
      },
      _count: {
        select: {
          replies: true,
          like: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
};

export const getThread = async (id: number) => {
  return await db.thread.findFirst({
    where: {
      id,
      threadId: null,
    },
    include: {
      image: {
        select: {
          image: true,
        },
      },
      author: {
        select: {
          username: true,
          id: true,
          fullname: true,
          profile: {
            select: {
              avatar: true,
              bio: true,
              cover: true,
            },
          },
        },
      },
      _count: {
        select: {
          replies: true,
          like: true,
        },
      },
    },
  });
};

export const getThreadByToken = async (id: number) => {
  return await db.thread.findMany({
    where: {
      userId: id,
      threadId: null,
    },
    include: {
      image: {
        select: {
          image: true,
        },
      },
      author: {
        select: {
          username: true,
          id: true,
          fullname: true,
          profile: {
            select: {
              avatar: true,
            },
          },
        },
      },
      _count: {
        select: {
          replies: true,
          like: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
};

export const getThreadByUserId = async (id: number) => {
  return await db.thread.findMany({
    where: {
      userId: id,
      threadId: null,
    },
    include: {
      image: {
        select: {
          image: true,
        },
      },
      author: {
        select: {
          username: true,
          id: true,
          fullname: true,
          thread: {
            select: {
              content: true,
              posted_at: true,
              id: true,
            },
          },
          profile: {
            select: {
              avatar: true,
            },
          },
        },
      },
      _count: {
        select: {
          replies: true,
          like: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
};

export const createThread = async (payload: any) => {
  const thread = await db.thread.create({
    data: {
      content: payload.content,
      userId: payload.userId,
      threadId: payload.threadId ? Number(payload.threadId) : null,
    },
  });

  // payload.image sekarang berisi array [{ image: 'https://res.cloudinary...' }]
  if (payload.image && payload.image.length > 0) {
    await db.threadImage.createMany({
      data: payload.image.map((img: any) => ({
        image: img.image,
        threadId: thread.id,
      })),
    });
  }

  return thread;
};


export const deleteThread = async (idThread: number, userId: number) => {
  const existedThread = await db.thread.findFirst({
    where: {
      id: idThread,
    },
  });

  if (!existedThread) throw new Error("thread not found");

  if (existedThread.userId !== userId)
    throw new Error("you dont have permission to delete this Thread ");

  await db.threadImage.deleteMany({
    where: {
      threadId: idThread,
    },
  });

  await db.thread.delete({
    where: {
      id: idThread,
    },
  });

  return true;
};

export const getReplies = async (threadId: number) => {
  return await db.thread.findMany({
    where: {
      threadId,
    },
    include: {
      image: {
        select: {
          image: true,
        },
      },
      author: {
        include: {
          profile: {
            select: {
              avatar: true,
            },
          },
        },
      },
      _count: {
        select: {
          replies: true,
          like: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
};


