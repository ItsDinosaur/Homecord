import { useEffect, useRef, useState } from "react";
import { Message } from "../types/Interfaces";
import { wsManager } from "./websocketManager";
export function useChatSocket() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(wsManager.getConnectionStatus());

    useEffect(() => {
        const messageListener = (message: Message) => {
            setMessages((prevMessages) => [message, ...prevMessages]);
        };

        const statusListener = (connected: boolean) => {
            setIsConnected(connected);
        }

        // Add listeners
        wsManager.addMessageListener(messageListener);
        wsManager.addStatusListener(statusListener);

        // Cleanup listeners on unmount
        return () => {
            wsManager.removeMessageListener(messageListener);
            wsManager.removeStatusListener(statusListener);
        }
    }, []);

    const connectWebSocket = async () => {
        await wsManager.connectWebSocket();
    };

    const disconnectWebSocket = () => {
        wsManager.disconnectWebSocket();
    };

    const sendMessage = (message: Message) => {
        wsManager.sendMessage(message);
    };

    return { isConnected, messages, connectWebSocket, disconnectWebSocket, sendMessage };
    
}
