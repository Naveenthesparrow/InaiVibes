import { Server } from "socket.io";

export function websocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins in development
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);
    socket.join("chat-room"); // Ensure messages are sent in one room

    socket.emit("message", "Welcome to Chat App!");
    socket.broadcast.emit(
      "message",
      `User ${socket.id.substring(0, 5)} connected`
    );

    socket.on("message", (data) => {
      console.log(`Received: ${data}`);
      io.to("chat-room").emit("message", `${socket.id.substring(0, 5)}: ${data}`);
    });

    socket.on("activity", (name) => {
      socket.broadcast.emit("activity", name);
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit(
        "message",
        `User ${socket.id.substring(0, 5)} disconnected`
      );
    });
  });
}
