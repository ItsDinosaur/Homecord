import "../appearance/Sidebar.css";
import React from "react";
import { Channel } from "../types/Interfaces";
import ChannelElement from "./ChannelElement";
import List from "../types/List";
import addChannelIcon from '../assets/add-channel.svg';


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



export function Sidebar({ channels, onSelectChannel }: SidebarProps) {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <button className="add-channel-button">
                    <img src={addChannelIcon} className="add-channel-icon" alt="Add Channel" />
                </button>
                
            </div>
            <div className="sidebar-content">
                <nav className="nav-links">
                    <List
                        items={channels} 
                        renderItem={(channel) => renderChannel(channel, onSelectChannel)}
                    />
                </nav>
            </div>
            <div className="sidebar-footer">
                
                <p>Powered by Homecord</p>
            </div>
        </div>
    );
}

