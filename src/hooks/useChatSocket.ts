import { useEffect, useState } from "react";
import { Message } from "../types/Interfaces";
import { wsManager } from "./websocketManager";

export function useChatSocket(channelId?: number) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(wsManager.getConnectionStatus());

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

        console.log(`Setting up message listener for channel ${channelId}`);

        const messageListener = (message: Message) => {
            console.log(`Received message in hook for channel ${channelId}:`, message);
            setMessages((prevMessages) => [message, ...prevMessages]);
        };

        // Add listener for this specific channel
        wsManager.addChannelMessageListener(channelId, messageListener);

        // Clear messages when switching channels
        setMessages([]);

        return () => {
            console.log(`Cleaning up message listener for channel ${channelId}`);
            wsManager.removeChannelMessageListener(channelId, messageListener);
        };
    }, [channelId]);

    const connectWebSocket = async () => {
        await wsManager.connectWebSocket();
    };

    const disconnectWebSocket = () => {
        wsManager.disconnectWebSocket();
    };

    const sendMessage = (message: Message) => {
        if (channelId) {
            wsManager.sendMessage(message, channelId);
        } else {
            console.warn("❌ Cannot send message: No channel ID provided");
        }
    };

    return { 
        isConnected, 
        messages, 
        connectWebSocket, 
        disconnectWebSocket, 
        sendMessage,
        // Debug helper
        listenerCounts: wsManager.getChannelListenerCounts()
    };
}
