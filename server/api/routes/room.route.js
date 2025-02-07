import express from "express"
import { authenticateToken } from "../middleware/auth.js"
import Room from "../models/room.model.js"

const router = express.Router()

// Create a new room
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, type, password } = req.body

    const room = new Room({
      name,
      type,
      password,
      host: req.userId,
      members: [
        {
          user: req.userId,
          role: "host",
          status: "watching",
        },
      ],
    })

    await room.save()
    res.status(201).json(room)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Get all public rooms
router.get("/public", async (req, res) => {
  try {
    const rooms = await Room.find({ type: "public" })
      .populate("host", "name avatar")
      .populate("members.user", "name avatar")
    res.json(rooms)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get room by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("host", "name avatar")
      .populate("members.user", "name avatar")

    if (!room) {
      return res.status(404).json({ message: "Room not found" })
    }

    res.json(room)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Join a room
router.post("/:id/join", authenticateToken, async (req, res) => {
  try {
    const { password } = req.body
    const room = await Room.findById(req.params.id)

    if (!room) {
      return res.status(404).json({ message: "Room not found" })
    }

    if (room.type === "private" && password !== room.password) {
      return res.status(403).json({ message: "Invalid password" })
    }

    // Check if user is already a member
    const isMember = room.members.some((member) => member.user.toString() === req.userId)

    if (!isMember) {
      room.members.push({
        user: req.userId,
        role: "member",
        status: "watching",
      })
      await room.save()
    }

    res.json(room)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Update room settings (host only)
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)

    if (!room) {
      return res.status(404).json({ message: "Room not found" })
    }

    if (room.host.toString() !== req.userId) {
      return res.status(403).json({ message: "Only host can update room settings" })
    }

    const updates = req.body
    Object.keys(updates).forEach((key) => {
      if (key !== "host" && key !== "members") {
        room[key] = updates[key]
      }
    })

    await room.save()
    res.json(room)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete room (host only)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)

    if (!room) {
      return res.status(404).json({ message: "Room not found" })
    }

    if (room.host.toString() !== req.userId) {
      return res.status(403).json({ message: "Only host can delete room" })
    }

    await room.remove()
    res.json({ message: "Room deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router

