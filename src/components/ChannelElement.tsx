import React, { useState, useRef } from "react";
import { Channel } from '../types/Interfaces';
import hashtagChannelIcon from '../assets/hashtag-channel-icon.svg';
import volumeUpIcon from '../assets/volume-up-channel-icon.svg';
import shoppingCartIcon from '../assets/shopping-cart-channel-icon.svg';
import loginIcon from '../assets/login-icon.svg';

function ChannelElement({ channel }: { channel: Channel }) {
    const [showFullName, setShowFullName] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);;

    const handleMouseEnter = () => {
        timerRef.current = setTimeout(() => {
            setShowFullName(true);
        }, 1000); // 1 second delay
    };

    const handleMouseLeave = () => {
        clearTimeout(timerRef.current!);
        setShowFullName(false);
    };

    return (
        <div className="channel-item" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <a className="channel-name">
                {channel.type === 'text' && <img src={hashtagChannelIcon} className="channel-icon hashtag" alt="Text Channel Icon" />}
                {channel.type === 'voice' && <img src={volumeUpIcon} className="channel-icon volume-up" alt="Voice Channel Icon" />}
                {channel.type === 'shopping' && <img src={shoppingCartIcon} className="channel-icon shopping-cart" alt="Shopping Channel Icon" />}
                {channel.type === 'login' && <img src={loginIcon} className="channel-icon login" alt="Login Icon" />}
                <b>{channel.name.length>=12 ? channel.name.slice(0,10)+"..." : channel.name}</b>
            </a>
            {showFullName && <div className="full-name">{channel.name}</div>}
        </div>
    );
}
export default ChannelElement;