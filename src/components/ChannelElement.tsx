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
                {channel.channel_type === 'text' && <img src={hashtagChannelIcon} className="channel-icon hashtag" alt="Text Channel Icon" />}
                {channel.channel_type === 'voice' && <img src={volumeUpIcon} className="channel-icon volume-up" alt="Voice Channel Icon" />}
                {channel.channel_type === 'shopping' && <img src={shoppingCartIcon} className="channel-icon shopping-cart" alt="Shopping Channel Icon" />}
                {channel.channel_type === 'login' && <img src={loginIcon} className="channel-icon login" alt="Login Icon" />}
                <b>{channel.channel_name.length>=12 ? channel.channel_name.slice(0,10)+"..." : channel.channel_name}</b>
            </a>
            {showFullName && <div className="full-name">{channel.channel_name}</div>}
        </div>
    );
}
export default ChannelElement;