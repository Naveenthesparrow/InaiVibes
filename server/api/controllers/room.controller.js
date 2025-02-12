import Room from "../models/room.model.js";
import Message from "../models/message.model.js";

export const createRoom = async (req, res) => {
    try {
        const { name, type, password } = req.body;
        const newRoom = new Room({
            name,
            type,
            password: type === "private" ? password : undefined,
            host: req.user.id,
            members: [{ user: req.user.id, role: "host" }],
        });
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const joinRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: "Room not found" });
        room.members.push({ user: req.user.id, role: "member" });
        await room.save();
        res.json({ message: "Joined room successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const leaveRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: "Room not found" });
        room.members = room.members.filter(m => m.user.toString() !== req.user.id);
        await room.save();
        res.json({ message: "Left room successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getRoomMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await Message.find({ roomId }).populate("senderId", "name");
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};