import "../appearance/Sidebar.css";
import React from "react";
import { Channel } from "../types/Interfaces";
import ChannelElement from "./ChannelElement";
import List from "../types/List";
import addChannelIcon from '../assets/add-channel.svg';
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";

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

const style = {
    borderRadius: 1,
    border: '.5px solid',
};

export function Sidebar({ channels, onSelectChannel }: SidebarProps) {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <button className="add-channel-button">
                    <img src={addChannelIcon} className="add-channel-icon" alt="Add Channel" />
                </button>
                <Divider variant="middle" sx={{ ...style}} />
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
                <Divider variant="middle" sx={{ ...style}} />
                <p>Powered by Homecord</p>
            </div>
        </div>
    );
}

