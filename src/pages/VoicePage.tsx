import React from "react";
import { Channel } from "../types/Interfaces";

interface VoicePageProps {
  channel: Channel;
}

function VoicePage({ channel }: VoicePageProps) {
    return (
        <div className="voice-page">
            <h1>Voice Page</h1>
            <p>This is the voice page where users can join voice channels.</p>
            {/* Add more components or content as needed */}
        </div>
    );
}
export default VoicePage;