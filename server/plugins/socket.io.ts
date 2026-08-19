// server/plugins/socket.io.ts
import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import jwt from "jsonwebtoken";

import {
  createMessage,
  getConversationById,
  markMessagesAsRead,
} from "~/server/services/chatServices";

const JWT_SECRET = process.env.SECRET_KEY || "rahasiaSuperSusahDitebak123!@#";

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server();

  io.bind(engine);

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      socket.data.userId = decoded.id;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as number;

    // Room untuk notifikasi per-user (update daftar percakapan)
    socket.join(`user:${userId}`);

    socket.on("chat:join", async (conversationId: number, callback?: (res: { status: boolean; data?: unknown; message?: string }) => void) => {
      const id = Number(conversationId);

      try {
        const conversation = await getConversationById(id, userId);
        await socket.join(`conversation:${id}`);
        socket.data.activeConversationId = id;

        if (typeof callback === "function") {
          callback({ status: true, data: conversation });
        }
      } catch (error) {
        const err = error as Error;
        if (typeof callback === "function") {
          callback({ status: false, message: err.message });
        }
      }
    });

    socket.on("chat:leave", (conversationId: number) => {
      socket.leave(`conversation:${Number(conversationId)}`);
      socket.data.activeConversationId = null;
    });

    socket.on("chat:message", async (payload: { conversationId: number; content: string }, callback?: (res: { status: boolean; data?: unknown; message?: string }) => void) => {
      const conversationId = Number(payload?.conversationId);
      const content = payload?.content?.trim?.() ?? "";

      if (!conversationId || !content) {
        if (typeof callback === "function") {
          callback({ status: false, message: "conversationId and content are required" });
        }
        return;
      }

      try {
        const message = await createMessage(conversationId, userId, content);

        io.to(`conversation:${conversationId}`).emit("chat:message:new", message);

        // Beri tahu peserta lain untuk update daftar percakapan
        const conversation = await getConversationById(conversationId, userId);
        const otherUserIds = conversation.participants
          .map((p) => p.user.id)
          .filter((id) => id !== userId);

        for (const otherId of otherUserIds) {
          io.to(`user:${otherId}`).emit("chat:conversation:update", { conversationId });
        }

        if (typeof callback === "function") {
          callback({ status: true, data: message });
        }
      } catch (error) {
        const err = error as Error;
        if (typeof callback === "function") {
          callback({ status: false, message: err.message });
        }
      }
    });

    socket.on("chat:typing", (payload: { conversationId: number; isTyping: boolean }) => {
      const conversationId = Number(payload?.conversationId);
      if (!conversationId) return;

      socket.to(`conversation:${conversationId}`).emit("chat:typing", {
        conversationId,
        userId,
        isTyping: !!payload?.isTyping,
      });
    });

    socket.on("chat:read", async (conversationId: number) => {
      const id = Number(conversationId);
      if (!id) return;

      await markMessagesAsRead(id, userId);

      io.to(`conversation:${id}`).emit("chat:read", {
        conversationId: id,
        userId,
      });
    });

    socket.on("disconnect", () => {
      socket.data.activeConversationId = null;
    });
  });

  nitroApp.router.use("/socket.io/", defineEventHandler({
    handler(event) {
      engine.handleRequest(event.node.req, event.node.res);
      event._handled = true;
    },
    websocket: {
      open(peer) {
        // @ts-expect-error private method and property
        engine.prepare(peer._internal.nodeReq);
        // @ts-expect-error private method and property
        engine.onWebSocket(peer._internal.nodeReq, peer._internal.nodeReq.socket, peer.websocket);
      },
    },
  }));
});
