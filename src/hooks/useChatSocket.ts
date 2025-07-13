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
let globalStateUpdateCallbacks: (() => void)[] = [];

// Function to notify all components of state changes
const notifyGlobalStateUpdate = () => {
    globalStateUpdateCallbacks.forEach(callback => callback());
};

// Initialize global listeners - call this on login
export const initializeGlobalChatListeners = (initialMessages?: { channelId: string, messages: Message[] }[]) => {
    if (globalListenersInitialized) {
        console.log("🌐 Global listeners already initialized");
        return;
    }

    console.log("🌐 Initializing global channel listeners");
    // Populate global state with initial messages if provided
    if (initialMessages) {
        initialMessages.forEach(({ channelId, messages }) => {
            globalChannelMessages.set(channelId, messages);
        });
        // Notify all components to update with initial messages
        notifyGlobalStateUpdate();
    }

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
        
        // Notify all components to update
        notifyGlobalStateUpdate();
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
        
        // Notify all components to update
        notifyGlobalStateUpdate();
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
        
        // Notify all components to update
        notifyGlobalStateUpdate();
    };

    // Add global listeners - these will persist across channel switches
    wsManager.addListener("chat", globalChatMessageListener);
    wsManager.addListener("user_joined", globalUserJoinedListener);
    wsManager.addListener("user_left", globalUserLeftListener);

    globalListenersInitialized = true;
    console.log("✅ Global listeners initialized");
};

// Reset global state - call this on logout/disconnect
export const resetGlobalChatState = () => {
    globalChannelMessages.clear();
    globalListenersInitialized = false;
    globalStateUpdateCallbacks = [];
    console.log("🔄 Global chat state reset");
};

export function useChatSocket(channelId?: string) {
    const [messages, setMessages] = useState<Map<string, Message[]>>(globalChannelMessages);
    const [isConnected, setIsConnected] = useState(wsManager.getConnectionStatus());
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    // Register this component to receive global state updates
    useEffect(() => {
        const updateCallback = () => {
            setMessages(new Map(globalChannelMessages));
        };

        globalStateUpdateCallbacks.push(updateCallback);

        return () => {
            globalStateUpdateCallbacks = globalStateUpdateCallbacks.filter(cb => cb !== updateCallback);
        };
    }, []);

    useEffect(() => {
        const statusListener = (connected: boolean) => {
            setIsConnected(connected);
            
            // Reset global listeners if connection is lost
            if (!connected) {
                resetGlobalChatState();
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
            setMessages(new Map(globalChannelMessages));
        }

        // Clear online users when switching channels
        setOnlineUsers([]);

        return () => {
            console.log(`Cleaning up for channel ${channelId}`);
            
            // Leave channel when component unmounts or channelId changes
            if (isConnected) {
                //wsManager.leaveChannel(channelId);
            }
        };
    }, [channelId, isConnected]);

    const connectWebSocket = async () => {
        await wsManager.connectWebSocket();
        // Initialize global listeners after connection
        if (wsManager.getConnectionStatus()) {
            initializeGlobalChatListeners();
        }
    };

    const disconnectWebSocket = () => {
        wsManager.disconnectWebSocket();
        resetGlobalChatState();
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
