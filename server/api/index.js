import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { websocket } from "./ws/websocket.js"; // Ensure correct import

dotenv.config();

mongoose
  .connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB!", err);
  });

const app = express();
const server = createServer(app); // Use http server for WebSocket
    console.log("Connected to MongoDB!")
  .catch((err) => {
    console.log("Failed to connect to MongoDB!", err)
  })


const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
})

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

server.listen(3000, () => {
  console.log("Server is listening on port 3000!");
});

// Initialize WebSocket and pass the server instance
websocket(server);

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  })
})

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`)
})

