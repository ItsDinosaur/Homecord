
export interface Channel {
    id: number;
    name: string;
    type: "text" | "voice" | "shopping" | "login";
}
export interface Message {
    id: number;
    channelId: number;
    content: string;
    timestamp: string;
    imageUrl?: string;
}