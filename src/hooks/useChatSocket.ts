import { useEffect, useRef, useState } from "react";
import { Message } from "../types/Interfaces";
import { invoke } from "@tauri-apps/api/core";

export function useChatSocket(channelId: number) {
    const [messages, setMessages] = useState<Message[]>([]);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const access_token = invoke("get_access_token");
        console.log("Connecting to WebSocket for channel:", channelId);
        const socket = new WebSocket(`ws://homecord.itsdinosaur.com/protected/ws/${channelId}?token=${access_token}`);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("WebSocket connection established");
        };

        socket.onmessage = (event) => {
            const newMessage: Message = JSON.parse(event.data);
            setMessages((prevMessages) => [newMessage, ...prevMessages]);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        }
        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            socket.close();
        }
    }, [channelId]);

    const sendMessage = (message: Message) => {
        socketRef.current?.send(JSON.stringify(message));
    };

    return {messages, sendMessage};
}