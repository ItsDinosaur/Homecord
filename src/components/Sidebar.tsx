import { useState } from "react";
import "../appearance/Sidebar.css";
import { Channel } from "../types/Interfaces";
import ChannelElement from "./ChannelElement";
import List from "../types/List";

interface SidebarProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

const renderChannel = (channel: Channel,
    onSelectChannel: (channel: Channel) => void
) => {
    return (
        <div onClick={() => onSelectChannel(channel)}>

            <ChannelElement channel={channel} />
        </div>
    );
};

//for now
const channels: Channel[] = [
    { id: 1, name: "General", type: "text" },
    { id: 2, name: "Voice Chat", type: "voice" },
    { id: 3, name: "Shopping", type: "shopping" },
];

export function Sidebar({ channels, onSelectChannel }: SidebarProps) {
    return (
        <div className={`sidebar`}>
        <nav className="nav-links">
            <List items={channels} 
            renderItem={(channel) => renderChannel(channel, onSelectChannel)} />
        </nav>
        </div>
    );
}

