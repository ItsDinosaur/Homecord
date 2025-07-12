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
    const endRef = useRef<HTMLDivElement>(null);
    const { 
        messages, 
        onlineUsers, 
        sendMessage, 
        isConnected, 
        listenerCounts 
    } = useChatSocket(channel.channel_id);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessage: Message = {
            username: "kai", // Replace with actual username
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
            <div className="chat-header">
                <h1>{channel.channel_name} {!isConnected && "(Disconnected)"}</h1>
                <div className="online-users">
                    Online: {onlineUsers.join(", ")} ({onlineUsers.length})
                </div>
            </div>
            
            <div className="debug-info">
                Channel ID: {channel.channel_id} | 
                Chat Listeners: {listenerCounts.chat || 0} | 
                Join Listeners: {listenerCounts.user_joined || 0} | 
                Leave Listeners: {listenerCounts.user_left || 0}
            </div>
            
            <div className="chat-content" ref={endRef}>
                {[...messages].reverse().map((message, index) => (
                    <div 
                        key={index} 
                        className={`message ${
                            message.username === "kai" ? "own" : 
                            message.username === "System" ? "system" : "other"
                        }`}
                    >
                        <div className="message-content">
                            <strong>{message.username}:</strong> {message.content}
                        </div>
                        <span className="timestamp">
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
            </div>
            
            <div className="message-input-container">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    disabled={!isConnected}
                />
                <button 
                    onClick={handleSend} 
                    disabled={!isConnected || !input.trim()}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
export default ChatPage;

/*
return (
        <div className="chat-page">
        <h1>{channel.name}</h1>
        <div className="chat-content" ref={endRef}>
            {/* Here you can render messages, chat history, etc. }
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
    */