
export interface Channel {
    id: number;
    name: string;
    type: "text" | "voice" | "shopping" | "login";
}
export interface Message {
    username: string;
    channelId: number;
    content: string;
    timestamp: string;
    imageUrl?: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
}