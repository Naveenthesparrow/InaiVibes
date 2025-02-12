import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("ws://localhost:3500", { transports: ["websocket"] });

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [activity, setActivity] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    socket.on("message", (data) => {
      setActivity(""); // Clear activity status
      setMessages((prev) => [...prev, data]);
    });

    socket.on("activity", (name) => {
      setActivity(`${name} is typing...`);
      setTimeout(() => setActivity(""), 3000);
    });

    return () => {
      socket.off("message");
      socket.off("activity");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  const handleTyping = () => {
    if (!activity) {
      socket.emit("activity", socket.id.substring(0, 5));
      setActivity(true);
    }

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => setActivity(false), 3000));
  };

  return (
    <div className="chat-container">
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
        />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <p className="activity">{activity}</p>
    </div>
  );
}

export default App;
