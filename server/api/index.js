import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { createServer } from "http"
import { Server } from "socket.io"

import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js"
import roomRoutes from "./routes/room.route.js"
import { authenticateSocket } from "./middleware/auth.middleware.js"

dotenv.config()

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Connected to MongoDB!")
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB!", err)
  })

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
})

app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/room", roomRoutes)

// Socket.io middleware
io.use(authenticateSocket)

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.userId)

  // Join room
  socket.on("join-room", async ({ roomId }) => {
    try {
      // Join logic here (you can move this to a separate function)
      socket.join(roomId)
      io.to(roomId).emit("user-joined", { userId: socket.userId })
    } catch (err) {
      socket.emit("error", { message: err.message })
    }
  })

  // Leave room
  socket.on("leave-room", async ({ roomId }) => {
    try {
      // Leave logic here
      socket.leave(roomId)
      io.to(roomId).emit("user-left", { userId: socket.userId })
    } catch (err) {
      socket.emit("error", { message: err.message })
    }
  })

  // Video control events
  socket.on("video-play", ({ roomId, currentTime }) => {
    socket.to(roomId).emit("video-play", { currentTime })
  })

  socket.on("video-pause", ({ roomId, currentTime }) => {
    socket.to(roomId).emit("video-pause", { currentTime })
  })

  // Chat message
  socket.on("send-message", ({ roomId, message }) => {
    io.to(roomId).emit("new-message", {
      userId: socket.userId,
      message,
      timestamp: Date.now(),
    })
  })

  // Update video status
  socket.on("update-status", ({ roomId, status }) => {
    io.to(roomId).emit("status-updated", {
      userId: socket.userId,
      status,
    })
  })

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId)
    // Handle disconnect logic if needed
  })
})

// Error handling middleware
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

