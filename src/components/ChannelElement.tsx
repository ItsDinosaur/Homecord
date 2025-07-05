import React from 'react';
import { Channel } from '../types/Interfaces';
import hashtagChannelIcon from '../assets/hashtag-channel-icon.svg';
import volumeUpIcon from '../assets/volume-up-channel-icon.svg';
import shoppingCartIcon from '../assets/shopping-cart-channel-icon.svg';

function ChannelElement({ channel }: { channel: Channel }) {
    return (
        <div className="channel-item">
            <a className="channel-name">
                {channel.type === 'text' && <img src={hashtagChannelIcon} className="channel-icon hashtag" alt="Text Channel Icon" />}
                {channel.type === 'voice' && <img src={volumeUpIcon} className="channel-icon volume-up" alt="Voice Channel Icon" />}
                {channel.type === 'shopping' && <img src={shoppingCartIcon} className="channel-icon shopping-cart" alt="Shopping Channel Icon" />}
                <b>{channel.name}</b>
            </a>
        </div>
    );
}
export default ChannelElement;