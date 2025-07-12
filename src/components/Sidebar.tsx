import "../appearance/Sidebar.css";
import React, { useState } from "react";
import { Channel } from "../types/Interfaces";
import ChannelElement from "./ChannelElement";
import List from "../types/List";
import { UserProfileMenu } from "./UserProfileMenu";
import addChannelIcon from '../assets/add-channel.svg';
import exampleReactIcon from "../assets/react.svg"


interface SidebarProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  onLogout?: () => void;
  username?: string;
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



export function Sidebar({ channels, onSelectChannel, onLogout, username = "User" }: SidebarProps) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleProfileClick = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const handleMenuClose = () => {
        setIsUserMenuOpen(false);
    };

    const handleLogout = () => {
        setIsUserMenuOpen(false);
        if (onLogout) {
            onLogout();
        }
    };

    const handleSettings = () => {
        setIsUserMenuOpen(false);
        // Handle settings click
        console.log("Settings clicked");
    };

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
                <div className="user-profile-container">
                    <button 
                        className="user-profile-button" 
                        onClick={handleProfileClick}
                        aria-expanded={isUserMenuOpen}
                    >
                        <img src={exampleReactIcon} className="user-profile-icon" alt="User Profile" />
                    </button>
                    <span className="username-display">{username}</span>
                    <UserProfileMenu
                        isOpen={isUserMenuOpen}
                        onClose={handleMenuClose}
                        onLogout={handleLogout}
                        onSettings={handleSettings}
                        username={username}
                    />
                </div>
                <p>Powered by Homecord</p>
            </div>
        </div>
    );
}

