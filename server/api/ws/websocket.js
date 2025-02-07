import { Server } from "socket.io";

export function websocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:5500", "http://127.0.0.1:5500"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);

    socket.emit("message", "Welcome to Chat App!");
    socket.broadcast.emit(
      "message",
      `User ${socket.id.substring(0, 5)} connected`
    );

    socket.on("message", (data) => {
      console.log(data);
      io.emit("message", `${socket.id.substring(0, 5)}: ${data}`);
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit(
        "message",
        `User ${socket.id.substring(0, 5)} disconnected`
      );
    });

    socket.on("activity", (name) => {
      socket.broadcast.emit("activity", name);
    });
  });
}
