import React from "react";
import { Channel } from "../types/Interfaces";
import MessageInput from "../components/MessageInput";
import "../appearance/ChatPage.css";

interface ChatPageProps {
  channel: Channel;
}

function ChatPage({ channel }: ChatPageProps) {
    return (
        <div className="chat-page">
        <h1>Chat Page</h1>
        <div className="chat-content">
            {/* Here you can render messages, chat history, etc. */}
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
            <h1>awdadadd</h1>
        </div>
        <MessageInput />
        {/* Add more components or content as needed */}
        </div>
    );
    }
export default ChatPage;