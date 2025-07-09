import React, { useEffect } from "react";
import { Channel } from "../types/Interfaces";
import MessageInput from "../components/MessageInput";
import "../appearance/ChatPage.css";
import exampleImage from "../assets/example.png"; // Example image path
import exampleImage2 from "../assets/example2.png"; // Another example image path

interface ChatPageProps {
  channel: Channel;
}

function ChatPage({ channel }: ChatPageProps) {
    const endRef = React.createRef<HTMLDivElement>();

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);
    return (
        <div className="chat-page">
        <h1>{channel.name}</h1>
        <div className="chat-content">
            {/* Here you can render messages, chat history, etc. */}
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
            <div ref={endRef}></div>
        </div>
        <div className="MessageInput-container">
            <MessageInput />
        </div>
        </div>
    );
    }
export default ChatPage;