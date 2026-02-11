// server/api/auth/register.post.ts
import { register as registerService } from "../../services/userServices";
import { createError, sendError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const result = await registerService(body);

    return {
      status: true,
      message: "success",
      data: result,
    };
  } catch (error) {
    const err = error as Error;

    sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: err.message,
      })
    );
  }
});
