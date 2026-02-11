import { getUsers } from "~/server/services/userServices";


export default defineEventHandler(async () => {
  try {
    const users = await getUsers();

    return {
      status: true,
      message: "success",
      data: users,
    };
  } catch (error) {
    const err = error as Error;

    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    });
  }
});