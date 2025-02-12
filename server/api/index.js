import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./ws/socket.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB !");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB !", err);
  });

// const app = express();

// ✅ Move CORS setup to the top
app.use(
  cors({
    origin: "http://localhost:5173/", // ✅ Remove trailing slash
    credentials: true, // ✅ Allow cookies
  })
);
app.use(cookieParser());
app.use(express.json());

// ✅ Routes should come after CORS middleware
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get('/cookies',(req,res)=>{
  const cookies = req.cookies.accessToken;
  res.json({cookieValue:cookies})
})

server.listen(3000, (req,res) => {
  console.log("Server is listening on port 3000 !");
  
});

// ✅ Middleware for error handling (should be last)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
