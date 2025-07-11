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

// Global state for all channel messages (outside component)
let globalChannelMessages = new Map<string, Message[]>();
let globalListenersInitialized = false;

export function useChatSocket(channelId?: string) {
    const [messages, setMessages] = useState<Map<string, Message[]>>(globalChannelMessages);
    const [isConnected, setIsConnected] = useState(wsManager.getConnectionStatus());
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    // Initialize global listeners once when first component mounts after login
    useEffect(() => {
        if (!globalListenersInitialized && isConnected) {
            console.log("🌐 Initializing global channel listeners");
            initializeGlobalListeners();
            globalListenersInitialized = true;
        }
    }, [isConnected]);

    useEffect(() => {
        const statusListener = (connected: boolean) => {
            setIsConnected(connected);
            
            // Reset global listeners if connection is lost
            if (!connected) {
                globalListenersInitialized = false;
            }
        };

        wsManager.addStatusListener(statusListener);

        return () => {
            wsManager.removeStatusListener(statusListener);
        };
    }, []);

    useEffect(() => {
        if (!channelId) {
            console.log("No channelId provided");
            return;
        }

        console.log(`Setting up for channel ${channelId}`);

        // Join channel when component mounts or channelId changes
        if (isConnected) {
            wsManager.joinChannel(channelId);
        }

        // Initialize empty messages array for this channel if it doesn't exist
        if (!globalChannelMessages.has(channelId)) {
            globalChannelMessages.set(channelId, []);
            // Update local state to reflect global state change
            setMessages(new Map(globalChannelMessages));
        }

        // Clear online users when switching channels
        setOnlineUsers([]);

        return () => {
            console.log(`Cleaning up for channel ${channelId}`);
            
            // Leave channel when component unmounts or channelId changes
            if (isConnected) {
                wsManager.leaveChannel(channelId);
            }
        };
    }, [channelId, isConnected]);

    const initializeGlobalListeners = () => {
        // Global chat message listener - receives messages for ALL channels
        const globalChatMessageListener = (data: ChatMessage) => {
            console.log(`📨 Received global chat message for channel ${data.channelId}:`, data);
            const message: Message = {
                username: data.username,
                content: data.content,
                timestamp: data.timestamp
            };
            
            // Add message to the appropriate channel in global state
            const currentMessages = globalChannelMessages.get(data.channelId) || [];
            globalChannelMessages.set(data.channelId, [message, ...currentMessages]);
            
            // Update all components with new global state
            setMessages(new Map(globalChannelMessages));
        };

        // Global user joined listener
        const globalUserJoinedListener = (data: UserJoinedMessage) => {
            console.log(`👋 User ${data.username} joined channel ${data.channelId}`);
            
            // Add system message to the appropriate channel
            const systemMessage: Message = {
                username: "System",
                content: `${data.username} joined the channel`,
                timestamp: data.timestamp
            };
            
            const currentMessages = globalChannelMessages.get(data.channelId) || [];
            globalChannelMessages.set(data.channelId, [systemMessage, ...currentMessages]);
            
            // Update all components with new global state
            setMessages(new Map(globalChannelMessages));
        };

        // Global user left listener
        const globalUserLeftListener = (data: UserLeftMessage) => {
            console.log(`👋 User ${data.username} left channel ${data.channelId}`);
            
            // Add system message to the appropriate channel
            const systemMessage: Message = {
                username: "System",
                content: `${data.username} left the channel`,
                timestamp: data.timestamp
            };
            
            const currentMessages = globalChannelMessages.get(data.channelId) || [];
            globalChannelMessages.set(data.channelId, [systemMessage, ...currentMessages]);
            
            // Update all components with new global state
            setMessages(new Map(globalChannelMessages));
        };

        // Add global listeners - these will persist across channel switches
        wsManager.addListener("chat", globalChatMessageListener);
        wsManager.addListener("user_joined", globalUserJoinedListener);
        wsManager.addListener("user_left", globalUserLeftListener);

        console.log("✅ Global listeners initialized");
    };

    const connectWebSocket = async () => {
        await wsManager.connectWebSocket();
    };

    const disconnectWebSocket = () => {
        wsManager.disconnectWebSocket();
        // Reset global state on disconnect
        globalChannelMessages.clear();
        globalListenersInitialized = false;
        setMessages(new Map());
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

    // Get messages for the current channel
    const getCurrentChannelMessages = (): Message[] => {
        if (!channelId) return [];
        return globalChannelMessages.get(channelId) || [];
    };

    // Get all channel messages (for debugging)
    const getAllChannelMessages = (): Map<string, Message[]> => {
        return new Map(globalChannelMessages);
    };

    // Get message counts for all channels
    const getChannelMessageCounts = (): Record<string, number> => {
        const counts: Record<string, number> = {};
        globalChannelMessages.forEach((messages, channelId) => {
            counts[channelId] = messages.length;
        });
        return counts;
    };

    return { 
        isConnected, 
        messages: getCurrentChannelMessages(), // Only current channel messages
        allChannelMessages: getAllChannelMessages(), // All channel messages for debugging
        channelMessageCounts: getChannelMessageCounts(), // Message counts per channel
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
