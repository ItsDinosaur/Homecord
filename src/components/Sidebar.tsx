import "../appearance/Sidebar.css";
import { useState } from "react";
import { Channel } from "../types/Interfaces";
import ChannelElement from "./ChannelElement";
import List from "../types/List";
import { UserProfileMenu } from "./UserProfileMenu";
import addChannelIcon from '../assets/add-channel.svg';
import exampleReactIcon from "../assets/react.svg"
import { AddChannelMenu } from "./AddChannelMenu";


interface SidebarProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  onLogout?: () => void;
  onOpenSettings?: () => void; // Add this prop
  onAdd?: (channelName: string) => void // Accept channel name parameter
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



export function Sidebar({ channels, onSelectChannel, onLogout, onOpenSettings, onAdd, username = "User" }: SidebarProps) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isAddChannelMenuOpen, setIsAddChannelMenuOpen] = useState(false);


    const handleProfileClick = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const handleUserMenuClose = () => {
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
        if (onOpenSettings) {
            onOpenSettings(); // Call the settings handler from App.tsx
        }
    };

    const handleAddChannelClick = () => {
        setIsAddChannelMenuOpen(!isAddChannelMenuOpen);
    };

    const handleAddChannelMenuClose = () => {
        setIsAddChannelMenuOpen(false);
    };

    const handleAdd = (channelName: string) => { // Accept channel name parameter
        setIsAddChannelMenuOpen(false);
        if (onAdd) {
            onAdd(channelName); // Pass channel name to parent
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="add-channel-container">
                    <button 
                        className="add-channel-button" 
                        onClick={handleAddChannelClick} 
                        aria-expanded={isAddChannelMenuOpen}
                    >
                        <img src={addChannelIcon} className="add-channel-icon" alt="Add Channel" />
                    </button>
                    <AddChannelMenu
                        isOpen={isAddChannelMenuOpen}
                        onClose={handleAddChannelMenuClose}
                        onAdd={handleAdd} // Updated handler
                    />
                </div>
                
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
                        onClose={handleUserMenuClose}
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

