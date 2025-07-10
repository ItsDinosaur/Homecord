import { invoke } from "@tauri-apps/api/core";
import { Message } from "../types/Interfaces";

class WebSocketManager {
    private socket: WebSocket | null = null;
    private isConnected: boolean = false;
    private messageListeners: ((message: Message) => void)[] = [];
    private statusListeners: ((connected: boolean) => void)[] = [];

    async connectWebSocket(): Promise<void> {
        let cancelled = false;
        
        if (this.socket?.readyState === WebSocket.OPEN || 
            this.socket?.readyState === WebSocket.CONNECTING) {
            console.log("Connection already exists, skipping...");
            return;
        }

        try {
            const access_token = await invoke<string>("get_access_token");
            
            if (cancelled) {
                console.log("Effect cancelled during token fetch");
                return;
            }

            console.log("Creating WebSocket connection");
            
            const encoded_token = encodeURIComponent(access_token);
            this.socket = new WebSocket(`ws://homecord.itsdinosaur.com/protected/ws/?access_token=${encoded_token}`);
            
            // Add readyState logging
            console.log("WebSocket created, readyState:", this.socket.readyState);
            
            if (cancelled) {
                console.log("Effect cancelled after socket creation");
                this.socket.close();
                return;
            }

            this.socket.onopen = () => {
                if (cancelled) {
                    this.socket?.close();
                    return;
                }
                console.log("✅ WebSocket connection established");
                console.log("WebSocket readyState:", this.socket?.readyState);
                this.isConnected = true;
                this.notifyStatusListeners(true);
            };

            this.socket.onmessage = (event) => {
                if (cancelled) return;
                console.log("📨 Received raw message:", event.data);
                console.log("📨 Message type:", typeof event.data);
                
                try {
                    const newMessage: Message = JSON.parse(event.data);
                    console.log("📨 Parsed message:", newMessage);
                    this.notifyMessageListeners(newMessage);
                } catch (error) {
                    console.error("❌ Failed to parse message:", error);
                    console.error("❌ Raw data:", event.data);
                }
            };

            this.socket.onclose = (event) => {
                console.log("❌ WebSocket connection closed");
                console.log("Close code:", event.code);
                console.log("Close reason:", event.reason);
                console.log("Was clean:", event.wasClean);
                this.isConnected = false;
                this.notifyStatusListeners(false);
            };

            this.socket.onerror = (error) => {
                console.error("❌ WebSocket error:", error);
                console.log("WebSocket readyState:", this.socket?.readyState);
                this.isConnected = false;
                this.notifyStatusListeners(false);
            };

        } catch (error) {
            console.error("Failed to connect", error);
        }
    }

    disconnectWebSocket(): void {
        if(this.socket) {
            this.socket.close();
        }
        this.isConnected = false;
        this.notifyStatusListeners(false);
    };

    sendMessage(message: Message): void {
        console.log("🚀 Attempting to send message:", message);
        console.log("🚀 WebSocket readyState:", this.socket?.readyState);
        console.log("🚀 WebSocket.OPEN constant:", WebSocket.OPEN);
        
        if (this.socket?.readyState === WebSocket.OPEN) {
            const messageStr = JSON.stringify(message);
            console.log("🚀 Sending JSON string:", messageStr);
            this.socket.send(messageStr);
            console.log("✅ Message sent successfully");
        } else {
            console.warn("❌ WebSocket is not connected");
            console.log("Current readyState:", this.socket?.readyState);
            console.log("Expected readyState (OPEN):", WebSocket.OPEN);
        }
    }

    getConnectionStatus(): boolean {
        return this.isConnected;
    }

    //Listeners management
    addMessageListener(listener: (message: Message) => void): void {
        this.messageListeners.push(listener);
    }
    removeMessageListener(listener: (message: Message) => void): void {
        this.messageListeners = this.messageListeners.filter(l => l !== listener);
    }

    addStatusListener(listener: (connected: boolean) => void): void {
        this.statusListeners.push(listener);
    }

    removeStatusListener(listener: (connected: boolean) => void): void {
        this.statusListeners = this.statusListeners.filter(l => l !== listener);
    }

    private notifyMessageListeners(message: Message): void {
        this.messageListeners.forEach(listener => listener(message));
    }

    private notifyStatusListeners(connected: boolean) : void {
        this.statusListeners.forEach(listener => listener(connected));
    }
}

export const wsManager = new WebSocketManager();