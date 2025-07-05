import React from "react";
import { Channel } from "../types/Interfaces";

interface ChatPageProps {
  channel: Channel;
}

function ChatPage({ channel }: ChatPageProps) {
    return (
        <div className="chat-page">
        <h1>Chat Page</h1>
        <p>This is the chat page where users can send and receive messages.</p>
        {/* Add more components or content as needed */}
        </div>
    );
    }
export default ChatPage;