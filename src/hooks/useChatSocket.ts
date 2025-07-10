import { useEffect, useRef, useState } from "react";
import { Message } from "../types/Interfaces";
import { invoke } from "@tauri-apps/api/core";

export function useChatSocket() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        let cancelled = false;

        const connectWebSocket = async () => {
            // If there's already a connection, don't create another
            if (socketRef.current?.readyState === WebSocket.OPEN || 
                socketRef.current?.readyState === WebSocket.CONNECTING) {
                console.log("Connection already exists, skipping...");
                return;
            }

            try {
                const access_token = await invoke<string>("get_access_token");
                
                // Check if effect was cancelled while getting token
                if (cancelled) {
                    console.log("Effect cancelled during token fetch");
                    return;
                }

                console.log("Creating WebSocket connection for channel:");
                
                const encoded_token = encodeURIComponent(access_token);
                const socket = new WebSocket(`ws://homecord.itsdinosaur.com/protected/ws/?access_token=${encoded_token}`);
                
                // Check again if cancelled after creating socket
                if (cancelled) {
                    console.log("Effect cancelled after socket creation");
                    socket.close();
                    return;
                }

                socketRef.current = socket;

                socket.onopen = () => {
                    if (cancelled) {
                        socket.close();
                        return;
                    }
                    console.log("WebSocket connection established");
                    setIsConnected(true);
                };

                socket.onmessage = (event) => {
                    if (cancelled) return;
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

        // Return cleanup function
        return () => {
            console.log("useEffect cleanup called");
            cancelled = true;
            if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
                socketRef.current.close();
            }
            socketRef.current = null;
            setIsConnected(false);
        };
    }, []);

    const sendMessage = (message: Message) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket is not connected");
        }
    };

    return { messages, sendMessage, isConnected };
}