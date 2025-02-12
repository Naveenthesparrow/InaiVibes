import express from "express";
import { createRoom, getRooms, joinRoom, leaveRoom, getRoomMessages } from "../controllers/room.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", verifyToken, createRoom);
router.get("/", verifyToken, getRooms);
router.post("/join/:roomId", verifyToken, joinRoom);
router.post("/leave/:roomId", verifyToken, leaveRoom);
router.get("/:roomId/messages", verifyToken, getRoomMessages);

export default router;
