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
