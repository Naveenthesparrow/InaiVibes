import React, { useEffect, useState } from "react";
import { useSocketContext } from "../contexts/socketContext";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";

const RoomChat = () => {
    const { roomId } = useParams(); 
    console.log("Joined Room:", roomId);
    const { socket } = useSocketContext();
    const authUser = useSelector((state) => state.user.authUser);
    console.log("🔍 Current authUser:", authUser);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/messages/${roomId}`);
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessages();
    }, [roomId]);

    useEffect(() => {
        if (!socket) return;

        socket.emit("joinRoom", roomId);

        socket.on("newMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.emit("leaveRoom", roomId);
            socket.off("newMessage");
        };
    }, [socket, roomId]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        
        const messageData = {
            senderId: authUser._id,
            roomId,
            message: newMessage,
        };

        try {
            const response = await axios.post("/api/messages/send", messageData);
            socket.emit("sendMessage", response.data);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="room-chat">
            <div className="messages">
                {messages.map((msg) => (
                    <div key={msg._id} className={msg.senderId === authUser._id ? "my-message" : "other-message"}>
                        <strong>{msg.senderId === authUser._id ? "You" : msg.sender.name}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default RoomChat;
