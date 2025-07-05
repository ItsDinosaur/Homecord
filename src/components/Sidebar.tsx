import { useState } from "react";
import "../pages/Sidebar.css";
import { Channel } from "../types/Interfaces";
import ChannelElement from "./ChannelElement";
import List from "../types/List";

const renderChannel = (channel: Channel) => {
    return (
        <>
            <ChannelElement channel={channel} />
        </>
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