import { useEffect, useRef, useState } from "react";
import { Message } from "../types/Interfaces";
import { invoke } from "@tauri-apps/api/core";

export function useChatSocket(channelId: number) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            return;
        }
        const connectWebSocket = async () => {
            try {
                const access_token = await invoke<string>("get_access_token");
                console.log("ACCESS_TOKEN = ", access_token);
                console.log("Connecting to WebSocket for channel:", channelId);
                
                const encoded_token = encodeURIComponent(access_token);
                const socket = new WebSocket(`ws://homecord.itsdinosaur.com/protected/ws/${channelId}?access_token=${encoded_token}`);
                socketRef.current = socket;

                socket.onopen = () => {
                    console.log("WebSocket connection established");
                    setIsConnected(true);
                };

                socket.onmessage = (event) => {
                    const newMessage: Message = JSON.parse(event.data);
                    setMessages((prevMessages) => [newMessage, ...prevMessages]);
                };

                socket.onclose = () => {
                    console.log("WebSocket connection closed");
                    setIsConnected(false);
                };

                socket.onerror = (error) => {
                    console.error("WebSocket error:", error);
                    setIsConnected(false);

                };
            } catch (error) {
                console.error("Failed to get access token:", error);
            }
        };

        connectWebSocket();

        // Cleanup function to close WebSocket on unmount
        return () => {
            if (socketRef.current) {
                console.log("Cleaning up WebSocket connection");
                socketRef.current.close();
                socketRef.current = null;
                setIsConnected(false);
            }
        };
    }, [channelId]);

    const sendMessage = (message: Message) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket is not connected");
        }
    };

    return { messages, sendMessage, isConnected };
}