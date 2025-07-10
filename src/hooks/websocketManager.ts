import { invoke } from "@tauri-apps/api/core";
import { Message } from "../types/Interfaces";

interface ChannelMessage extends Message {
    channelId: number;
}

class WebSocketManager {
    private socket: WebSocket | null = null;
    private isConnected: boolean = false;
    private messageListeners: Map<number, ((message: Message) => void)[]> = new Map();
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
                this.isConnected = true;
                this.notifyStatusListeners(true);
            };

            this.socket.onmessage = (event) => {
                if (cancelled) return;
                console.log("📨 Received raw message:", event.data);
                
                try {
                    const receivedMessage: ChannelMessage = JSON.parse(event.data);
                    console.log("📨 Parsed message:", receivedMessage);
                    console.log("📨 Message for channel:", receivedMessage.channelId);
                    
                    // Notify listeners for the specific channel
                    this.notifyChannelMessageListeners(receivedMessage.channelId, receivedMessage);
                } catch (error) {
                    console.error("❌ Failed to parse message:", error);
                    console.error("❌ Raw data:", event.data);
                }
            };

            this.socket.onclose = (event) => {
                console.log("❌ WebSocket connection closed");
                console.log("Close code:", event.code);
                console.log("Close reason:", event.reason);
                this.isConnected = false;
                this.notifyStatusListeners(false);
            };

            this.socket.onerror = (error) => {
                console.error("❌ WebSocket error:", error);
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
    }

    sendMessage(message: Message, channelId: number): void {
        console.log("🚀 Attempting to send message:", message, "to channel:", channelId);
        console.log("🚀 WebSocket readyState:", this.socket?.readyState);
        
        if (this.socket?.readyState === WebSocket.OPEN) {
            const channelMessage: ChannelMessage = {
                ...message,
                channelId: channelId
            };
            
            const messageStr = JSON.stringify(channelMessage);
            console.log("🚀 Sending JSON string:", messageStr);
            this.socket.send(messageStr);
            console.log("✅ Message sent successfully to channel", channelId);
        } else {
            console.warn("❌ WebSocket is not connected");
            console.log("Current readyState:", this.socket?.readyState);
        }
    }

    getConnectionStatus(): boolean {
        return this.isConnected;
    }

    // Channel-specific listener management
    addChannelMessageListener(channelId: number, listener: (message: Message) => void): void {
        if (!this.messageListeners.has(channelId)) {
            this.messageListeners.set(channelId, []);
        }
        this.messageListeners.get(channelId)!.push(listener);
        console.log(`Added listener for channel ${channelId}. Total listeners: ${this.messageListeners.get(channelId)!.length}`);
    }

    removeChannelMessageListener(channelId: number, listener: (message: Message) => void): void {
        const listeners = this.messageListeners.get(channelId);
        if (listeners) {
            const filtered = listeners.filter(l => l !== listener);
            if (filtered.length === 0) {
                this.messageListeners.delete(channelId);
                console.log(`Removed all listeners for channel ${channelId}`);
            } else {
                this.messageListeners.set(channelId, filtered);
                console.log(`Removed listener for channel ${channelId}. Remaining: ${filtered.length}`);
            }
        }
    }

    addStatusListener(listener: (connected: boolean) => void): void {
        this.statusListeners.push(listener);
    }

    removeStatusListener(listener: (connected: boolean) => void): void {
        this.statusListeners = this.statusListeners.filter(l => l !== listener);
    }

    private notifyChannelMessageListeners(channelId: number, message: Message): void {
        const listeners = this.messageListeners.get(channelId);
        if (listeners && listeners.length > 0) {
            console.log(`📢 Notifying ${listeners.length} listeners for channel ${channelId}`);
            listeners.forEach(listener => listener(message));
        } else {
            console.log(`📢 No listeners found for channel ${channelId}`);
        }
    }

    private notifyStatusListeners(connected: boolean): void {
        this.statusListeners.forEach(listener => listener(connected));
    }

    // Debug method to see current listeners
    getChannelListenerCounts(): Record<number, number> {
        const counts: Record<number, number> = {};
        this.messageListeners.forEach((listeners, channelId) => {
            counts[channelId] = listeners.length;
        });
        return counts;
    }
}

export const wsManager = new WebSocketManager();