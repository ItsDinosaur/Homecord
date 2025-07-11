
export interface Channel {
    id: string;
    name: string;
    type: "text" | "voice" | "shopping" | "login";
}
export interface Message {
    username: string;
    content: string;
    timestamp: string;
    imageUrl?: string;
    //channelId added automaticaly by sendMessage
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
}