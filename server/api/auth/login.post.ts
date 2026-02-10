// server/api/auth/login.post.ts
import { login as loginService } from "../../services/userServices";
import { createError, sendError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const result = await loginService(body);

    return {
      status: true,
      message: "Login success",
      data: result,
    };
  } catch (error) {
    const err = error as Error;
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: err.message,
      })
    );
  }
});
