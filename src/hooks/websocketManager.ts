import { invoke } from "@tauri-apps/api/core";
import { Message } from "../types/Interfaces";

interface WebSocketMessage {
    type: string;
    [key: string]: any;
}

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

class WebSocketManager {
    private socket: WebSocket | null = null;
    private isConnected: boolean = false;
    private listeners: Map<string, ((data: any) => void)[]> = new Map();
    private statusListeners: ((connected: boolean) => void)[] = [];
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectDelay: number = 1000; // Start with 1 second
    private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
    private shouldReconnect: boolean = true;

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
                this.reconnectAttempts = 0; // Reset attempts on successful connection
                this.reconnectDelay = 1000; // Reset delay
                this.notifyStatusListeners(true);
                this.startHeartbeat();
            };

            this.socket.onmessage = (event) => {
                if (cancelled) return;
                this.handleMessage(event);
            };

            this.socket.onclose = (event) => {
                console.log("❌ WebSocket connection closed");
                console.log("Close code:", event.code);
                console.log("Close reason:", event.reason);
                this.isConnected = false;
                this.stopHeartbeat();
                this.notifyStatusListeners(false);

                // Attempt to reconnect unless manually disconnected
                if (this.shouldReconnect && event.code !== 1000) {
                    this.attemptReconnect();
                }
            };

            this.socket.onerror = (error) => {
                console.error("❌ WebSocket error:", error);
                this.isConnected = false;
                this.stopHeartbeat();
                this.notifyStatusListeners(false);
            };

        } catch (error) {
            console.error("Failed to connect", error);
            if (this.shouldReconnect) {
                this.attemptReconnect();
            }
        }
    }
    private attemptReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log("❌ Max reconnection attempts reached");
            return;
        }

        this.reconnectAttempts++;
        console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectDelay}ms`);

        setTimeout(() => {
            this.connectWebSocket();
        }, this.reconnectDelay);

        // Exponential backoff with jitter
        this.reconnectDelay = Math.min(this.reconnectDelay * 2 + Math.random() * 1000, 30000);
    }

    private startHeartbeat(): void {
        this.stopHeartbeat(); // Clear any existing interval
        
        // Send ping every 30 seconds to keep connection alive
        this.heartbeatInterval = setInterval(() => {
            if (this.socket?.readyState === WebSocket.OPEN) {
                console.log("💓 Sending heartbeat ping");
                this.send({ type: "ping" });
            }
        }, 30000);
    }

    private stopHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }
    // Handle incoming messages based on type
    private handleMessage(event: MessageEvent): void {
        console.log("📨 Received raw message:", event.data);
        
        try {
            const data: WebSocketMessage = JSON.parse(event.data);
            console.log("📨 Parsed message:", data);
            console.log("📨 Message type:", data.type);
            
            const listeners = this.listeners.get(data.type) || [];
            console.log(`📢 Notifying ${listeners.length} listeners for type '${data.type}'`);
            
            listeners.forEach(callback => callback(data));
        } catch (error) {
            console.error("❌ Failed to parse message:", error);
            console.error("❌ Raw data:", event.data);
        }
    }

    // Register listeners for specific message types
    addListener(messageType: string, callback: (data: any) => void): void {
        if (!this.listeners.has(messageType)) {
            this.listeners.set(messageType, []);
        }
        this.listeners.get(messageType)!.push(callback);
        console.log(`Added listener for type '${messageType}'. Total listeners: ${this.listeners.get(messageType)!.length}`);
    }

    removeListener(messageType: string, callback: (data: any) => void): void {
        const listeners = this.listeners.get(messageType);
        if (listeners) {
            const filtered = listeners.filter(l => l !== callback);
            if (filtered.length === 0) {
                this.listeners.delete(messageType);
                console.log(`Removed all listeners for type '${messageType}'`);
            } else {
                this.listeners.set(messageType, filtered);
                console.log(`Removed listener for type '${messageType}'. Remaining: ${filtered.length}`);
            }
        }
    }

    // Send generic message
    private send(message: any): void {
        if (this.socket?.readyState === WebSocket.OPEN) {
            const messageStr = JSON.stringify(message);
            console.log("🚀 Sending message:", messageStr);
            this.socket.send(messageStr);
            console.log("✅ Message sent successfully");
        } else {
            console.warn("❌ WebSocket is not connected");
            console.log("Current readyState:", this.socket?.readyState);
        }
    }

    // Specific message type methods
    joinChannel(channelId: string): void {
        console.log(`🔗 Joining channel ${channelId}`);
        this.send({
            type: "join",
            channelId: channelId
        });
    }

    leaveChannel(channelId: string): void {
        console.log(`🚪 Leaving channel ${channelId}`);
        this.send({
            type: "leave",
            channelId: channelId
        });
    }

    sendChatMessage(content: string, channelId: string, username: string): void {
        console.log(`💬 Sending chat message to channel ${channelId}`);
        this.send({
            type: "chat",
            content: content,
            channelId: channelId,
            username: username,
            timestamp: new Date().toISOString()
        });
    }

    // Legacy method for backward compatibility
    sendMessage(message: Message, channelId: string): void {
        this.sendChatMessage(message.content, channelId, message.username);
    }

    disconnectWebSocket(): void {
        if (this.socket) {
            this.socket.close();
        }
        this.isConnected = false;
        this.notifyStatusListeners(false);
    }

    getConnectionStatus(): boolean {
        return this.isConnected;
    }

    // Status listener management
    addStatusListener(listener: (connected: boolean) => void): void {
        this.statusListeners.push(listener);
    }

    removeStatusListener(listener: (connected: boolean) => void): void {
        this.statusListeners = this.statusListeners.filter(l => l !== listener);
    }

    private notifyStatusListeners(connected: boolean): void {
        this.statusListeners.forEach(listener => listener(connected));
    }

    // Debug method to see current listeners
    getListenerCounts(): Record<string, number> {
        const counts: Record<string, number> = {};
        this.listeners.forEach((listeners, type) => {
            counts[type] = listeners.length;
        });
        return counts;
    }
}

export const wsManager = new WebSocketManager();