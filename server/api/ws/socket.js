import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js"; // Ensure the correct path

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // ✅ Removed trailing slash
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // ✅ Keep it as an object

export const getRecieverSocketId = (recieverId) => {
  return userSocketMap[recieverId] || null; // ✅ Fixed function call
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // **New Code for Room Chat**
  socket.on("joinRoom", ({ roomId, userId }) => {
    socket.join(roomId);
    console.log(`${userId} joined room: ${roomId}`);
  });

  socket.on("sendMessage", async ({ roomId, senderId, message }) => {
    try {
      const newMessage = new Message({ roomId, senderId, message });
      await newMessage.save();
      io.to(roomId).emit("receiveMessage", { senderId, message });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (userId && userId in userSocketMap) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, io, server };
