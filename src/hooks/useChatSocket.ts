// useChatSocket.ts
import { useEffect, useState } from "react";
import { Message } from "../types/Interfaces";
import { wsManager } from "./websocketManager";

interface ChatMessage {
    type: "chat";
    content: string;
    username: string;
    channelId: string;
    timestamp: string;
}

interface UserJoinedMessage {
    type: "user_joined";
    username: string;
    channelId: string;
    timestamp: string;
}

interface UserLeftMessage {
    type: "user_left";
    username: string;
    channelId: string;
    timestamp: string;
}

export function useChatSocket(channelId?: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(wsManager.getConnectionStatus());
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
        const statusListener = (connected: boolean) => {
            setIsConnected(connected);
        };

        wsManager.addStatusListener(statusListener);

        return () => {
            wsManager.removeStatusListener(statusListener);
        };
    }, []);

    useEffect(() => {
        if (!channelId) {
            console.log("No channelId provided, skipping message listener setup");
            return;
        }

        console.log(`Setting up message listeners for channel ${channelId}`);

        // Chat message listener
        const chatMessageListener = (data: ChatMessage) => {
            if (data.channelId === channelId) {
                console.log(`Received chat message for channel ${channelId}:`, data);
                const message: Message = {
                    username: data.username,
                    content: data.content,
                    timestamp: data.timestamp
                };
                setMessages((prevMessages) => [message, ...prevMessages]);
            }
        };

        // User joined listener
        const userJoinedListener = (data: UserJoinedMessage) => {
            if (data.channelId === channelId) {
                console.log(`User ${data.username} joined channel ${channelId}`);
                setOnlineUsers((prevUsers) => {
                    if (!prevUsers.includes(data.username)) {
                        return [...prevUsers, data.username];
                    }
                    return prevUsers;
                });
                // Optionally add a system message
                const systemMessage: Message = {
                    username: "System",
                    content: `${data.username} joined the channel`,
                    timestamp: data.timestamp
                };
                setMessages((prevMessages) => [systemMessage, ...prevMessages]);
            }
        };

        // User left listener
        const userLeftListener = (data: UserLeftMessage) => {
            if (data.channelId === channelId) {
                console.log(`User ${data.username} left channel ${channelId}`);
                setOnlineUsers((prevUsers) => 
                    prevUsers.filter(user => user !== data.username)
                );
                // Optionally add a system message
                const systemMessage: Message = {
                    username: "System",
                    content: `${data.username} left the channel`,
                    timestamp: data.timestamp
                };
                setMessages((prevMessages) => [systemMessage, ...prevMessages]);
            }
        };

        // Add listeners
        wsManager.addListener("chat", chatMessageListener);
        wsManager.addListener("user_joined", userJoinedListener);
        wsManager.addListener("user_left", userLeftListener);

        // Join channel when component mounts
        if (isConnected) {
            wsManager.joinChannel(channelId);
        }

        /* WHY TF WE DID IT
        // Clear messages when switching channels
        setMessages([]);*/
        // Clear online users when switching channels
        setOnlineUsers([]);

        return () => {
            console.log(`Cleaning up message listeners for channel ${channelId}`);
            wsManager.removeListener("chat", chatMessageListener);
            wsManager.removeListener("user_joined", userJoinedListener);
            wsManager.removeListener("user_left", userLeftListener);
            
            // Leave channel when component unmounts
            if (isConnected) {
                wsManager.leaveChannel(channelId);
            }
        };
    }, [channelId, isConnected]);

    const connectWebSocket = async () => {
        await wsManager.connectWebSocket();
    };

    const disconnectWebSocket = () => {
        wsManager.disconnectWebSocket();
    };

    const sendMessage = (message: Message) => {
        if (channelId) {
            wsManager.sendChatMessage(message.content, channelId, message.username);
        } else {
            console.warn("❌ Cannot send message: No channel ID provided");
        }
    };

    const joinChannel = (newChannelId: string) => {
        wsManager.joinChannel(newChannelId);
    };

    const leaveChannel = (channelIdToLeave: string) => {
        wsManager.leaveChannel(channelIdToLeave);
    };

    return { 
        isConnected, 
        messages, 
        onlineUsers,
        connectWebSocket, 
        disconnectWebSocket, 
        sendMessage,
        joinChannel,
        leaveChannel,
        // Debug helper
        listenerCounts: wsManager.getListenerCounts()
    };
}
