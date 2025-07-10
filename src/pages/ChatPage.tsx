import React, { useEffect, useRef, useState } from "react";
import { Channel } from "../types/Interfaces";
import "../appearance/ChatPage.css";
import exampleImage from "../assets/example.png"; // Example image path
import exampleImage2 from "../assets/example2.png"; // Another example image path
import { useChatSocket } from "../hooks/useChatSocket";
import { Message } from "../types/Interfaces";
import { Grid } from "@mui/material";

interface ChatPageProps {
  channel: Channel;
}

function ChatPage({ channel }: ChatPageProps) {
    const endRef = React.createRef<HTMLDivElement>();
    const {messages, sendMessage} = useChatSocket(channel.id);
    const [input, setInput] = useState("");

    const handleSend = () => {
        const newMessage: Message = {
            username: "kai", // Replace with actual username
            channelId: channel.id,
            content: input,
            timestamp: new Date().toISOString(),
        };
        console.log("Sending message:", newMessage);
        sendMessage(newMessage);
        setInput("");
    };

    useEffect(() => {
        endRef.current?.scrollTo({ top: endRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);
    return (
        <div className="chat-page">
        <h1>{channel.name}</h1>
        <div className="chat-content" ref={endRef}>
            {/* Here you can render messages, chat history, etc. */}
            {[...messages].reverse().map((message, index) => (
                <div key={index} className={`message ${message.username === "kai" ? "own" : "other"}`}>
                    <div className="message-content">
                        <p>{message.content}</p>
                    </div>
                    {message.imageUrl && <img src={message.imageUrl} alt="Message attachment" />}
                    <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
            ))}
        </div>
        <div className="MessageInput-container">
            <Grid>
            <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
            />
            <button onClick={handleSend} className="send-button">Send</button>
            </Grid>
        </div>
        </div>
    );
    }
export default ChatPage;