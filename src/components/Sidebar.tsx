import { useState } from "react";
import "../pages/Sidebar.css";
import {Channel} from "../types/Interfaces";
import List from "../types/List";
import hashtagChannelIcon from "../assets/hashtag-channel-icon.svg";
import volumeUpIcon from "../assets/volume-up-channel-icon.svg";
import shoppingCartIcon from "../assets/shopping-cart-channel-icon.svg";

const renderChannel = (channel: Channel) => {
    return (
        <div className="channel-item">
            <a className="channel-name">{channel.name}
            {channel.type === "text" && <img src={hashtagChannelIcon} className="channel-icon hashtag" />}
            {channel.type === "voice" && <img src={volumeUpIcon} className="channel-icon volume-up" />}
            {channel.type === "shopping" && <img src={shoppingCartIcon} className="channel-icon shopping-cart" />}
            </a>
        </div>
    );
};

//for now
const channels: Channel[] = [
    { id: 1, name: "General", type: "text" },
    { id: 2, name: "Voice Chat", type: "voice" },
    { id: 3, name: "Shopping", type: "shopping" },
];

function Sidebar() {
    
    
    return (
        <div className={`sidebar`}>
        <nav className="nav-links">
            <List items={channels} renderItem={renderChannel} />
        </nav>
        </div>
    );
}

export default Sidebar;