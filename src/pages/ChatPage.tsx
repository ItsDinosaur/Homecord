import React, { useEffect, useRef, useState } from "react";
import { Channel } from "../types/Interfaces";
import "../appearance/ChatPage.css";
import { useChatSocket } from "../hooks/useChatSocket";
import { Message } from "../types/Interfaces";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import ReactMarkdown from "react-markdown";
import EmojiPicker from 'emoji-picker-react';

interface ChatPageProps {
  channel: Channel;
  username: string
}

function ChatPage({ channel, username }: ChatPageProps) {
    const endRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    //const previewRef = useRef<HTMLDivElement>(null);
    const { 
        messages, 
        onlineUsers, 
        sendMessage, 
        isConnected, 
        listenerCounts 
    } = useChatSocket(channel.channel_id);
    const [input, setInput] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessage: Message = {
            username: username,
            content: input,
            timestamp: new Date().toISOString(),
        };
        
        console.log("Sending message:", newMessage);
        sendMessage(newMessage);
        setInput("");
        setShowPreview(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInput(value);
        // Show preview if markdown syntax is detected
        setShowPreview(/[*_~`#\[\]|>-]/.test(value) && value.trim().length > 0);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleAddAttachment = () => {
        // Placeholder for attachment logic
        console.log("Attachment button clicked");
    };

    const handleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };
    const onEmojiClick = (emojiData: any) => {
        setInput(prevInput => prevInput + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    useEffect(() => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }
    }, [input]);

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
                            message.username === username ? "own" : 
                            message.username === "System" ? "system" : "other"
                        }`}
                    >
                        <div className="message-content">
                            <strong>{message.username}:</strong> 
                            <MarkdownRenderer>
                                {message.content}
                            </MarkdownRenderer>
                        </div>
                        <span className="timestamp">
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
                
            </div>
            {/* Floating preview positioned over chat content */}
                {showPreview && (
                    <div className="floating-preview">
                        <div className="preview-header">
                            <span className="preview-label">Preview</span>
                            <button 
                                className="preview-close"
                                onClick={() => setShowPreview(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="preview-content">
                            <ReactMarkdown
                                components={{
                                    p: ({ children }) => <p className="preview-paragraph">{children}</p>,
                                    strong: ({ children }) => <strong className="preview-bold">{children}</strong>,
                                    em: ({ children }) => <em className="preview-italic">{children}</em>,
                                    code: ({ children }) => <code className="preview-inline-code">{children}</code>,
                                    pre: ({ children }) => <pre className="preview-code-block">{children}</pre>,
                                    blockquote: ({ children }) => <blockquote className="preview-quote">{children}</blockquote>,
                                    ul: ({ children }) => <ul className="preview-list">{children}</ul>,
                                    ol: ({ children }) => <ol className="preview-list">{children}</ol>,
                                    h1: ({ children }) => <h1 className="preview-h1">{children}</h1>,
                                    h2: ({ children }) => <h2 className="preview-h2">{children}</h2>,
                                    h3: ({ children }) => <h3 className="preview-h3">{children}</h3>,
                                }}
                            >
                                {input}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
                {showEmojiPicker && (
                <div className="emoji-picker-container">
                    <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        autoFocusSearch={false}
                    />
                </div>
                )}
            
             <div className="message-input-container">
                <div className="textarea-container">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message... Use **bold**, *italic*, `code`"
                        disabled={!isConnected}
                    />
                </div>
                <div className="button-grid">
                    <button onClick={handleAddAttachment}
                            className="attachment-button">
                            📎
                    </button>
                    <button onClick={handleEmojiPicker}
                            className="emoji-button">
                            😀
                    </button>
                </div>
                
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