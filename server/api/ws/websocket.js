import { WebSocketServer } from "ws"; 

export const websocket = () => {
  const wss = new WebSocketServer({ port: 3001 });

  wss.on("connection", (socket) => {
    console.log("New WebSocket connection established.");

    socket.on("message", (message) => {
      console.log("Received message:", message);
      socket.send(`Echo: ${message}`);
      socket.send('connected')
    });

    socket.on("close", () => {
      console.log("WebSocket connection closed.");
    });
  });

  console.log("WebSocket server running on port 3001");
};
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
