import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {io} from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    const authUser = useSelector((state) => state.user.authUser);

    useEffect(() => {
        if (authUser) {
            console.log("🔄 Attempting to connect WebSocket...");

            const newSocket = io("http://localhost:3000/", {
                query: { userId: authUser._id },
            });

            setSocket(newSocket);

            newSocket.on("connection", () => {
                console.log("✅ WebSocket connected:", newSocket.id);
            });

            newSocket.on("connect_error", (err) => {
                console.error("❌ WebSocket connection error:", err);
            });

            newSocket.on("disconnect", (reason) => {
                console.warn("⚠️ WebSocket disconnected:", reason);
            });

            newSocket.on("getOnlineUsers", (users) => {
                console.log("👥 Online users received:", users);
                setOnlineUsers(users);
            });

            return () => {
                console.log("❌ Closing WebSocket...");
                newSocket.off("connect");
                newSocket.off("connect_error");
                newSocket.off("disconnect");
                newSocket.off("getOnlineUsers");
                newSocket.close();
            };
        } else {
            if (socket) {
                console.log("❌ Closing WebSocket due to missing authUser...");
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]); // ✅ No need to add `socket`, prevents unnecessary reconnections

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
