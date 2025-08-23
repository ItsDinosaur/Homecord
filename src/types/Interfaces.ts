
export interface Channel {
    channel_id: string,
    room_id: string,
    channel_name: string,
    description: string,
    channel_type: channelType,
    position: number,
}

export interface userOption {
    
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

export enum channelType {
    TEXT = "TEXT",
    VOICE = "VOICE",
}