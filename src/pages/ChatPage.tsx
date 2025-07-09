import React, { useEffect, useRef, useState } from "react";
import { Channel } from "../types/Interfaces";
import MessageInput from "../components/MessageInput";
import "../appearance/ChatPage.css";
import exampleImage from "../assets/example.png"; // Example image path
import exampleImage2 from "../assets/example2.png"; // Another example image path
import { useChatSocket } from "../hooks/useChatSocket";
import { Message } from "../types/Interfaces";

interface ChatPageProps {
  channel: Channel;
}

function ChatPage({ channel }: ChatPageProps) {
    const endRef = React.createRef<HTMLDivElement>();
    const {messages, sendMessage} = useChatSocket(channel.id);

    const handleSend = () => {
        const newMessage: Message = {
            username: "User1", // Replace with actual username
            channelId: channel.id,
            content: "This is a new message",
            timestamp: new Date().toISOString(),
            imageUrl: exampleImage // Optional image URL
        };
        sendMessage(newMessage);
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    return (
        <div className="chat-page">
        <h1>{channel.name}</h1>
        <div className="chat-content" ref={endRef}>
            {/* Here you can render messages, chat history, etc. */}
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.username === "User1" ? "own" : "other"}`}>
                    <div className="message-content">
                        <p>{message.content}</p>
                    </div>
                    {message.imageUrl && <img src={message.imageUrl} alt="Message attachment" />}
                    <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
            ))}
            <div className="message own">
                <div className="message-content">
                    <p>This is a sample message in the chat. And a little longer one..... ........
                        ....awdaw dadawdawdawda wdawdada
                        wdada</p>
                </div>
                <img src={exampleImage}></img>
                <span>1 minute ago</span>
            </div>
            <div className="message other">
                <div className="message-content">
                    <p>This is a sample message in the chat.</p>
                </div>
                <img src={exampleImage2}></img>
                <span>1 minute ago</span>
            </div>
        </div>
        <div className="MessageInput-container">
            <MessageInput />
        </div>
        </div>
    );
    }
export default ChatPage;