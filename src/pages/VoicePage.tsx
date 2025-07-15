import { Channel } from "../types/Interfaces";
import { useWebRTC } from '../hooks/useWebRTC';
import { useRef, useEffect } from "react";

interface VoicePageProps {
    channel: Channel;
    userId: string;
    ws: WebSocket;
}

function VoicePage({ channel, userId, ws }: VoicePageProps) {
    const {
        startVoice,
        startVideo,
        startScreenShare,
        remoteStreams,
        localStream
    } = useWebRTC(ws, userId);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

    useEffect(() => {
        if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        Object.entries(remoteStreams).forEach(([userId, stream]) => {
            if (remoteVideoRefs.current[userId]) {
                remoteVideoRefs.current[userId]!.srcObject = stream;
            }
        });
    }, [remoteStreams]);

    return (
        <div className="voice-page">
            <div>
                <button onClick={() => startVoice(channel.channel_id)}>Join Voice</button>
                <button onClick={startVideo}>Start Video</button>
                <button onClick={startScreenShare}>Share Screen</button>

                <div>
                    <h3>You</h3>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        style={{ width: '200px' }}
                    />
                </div>

                <div>
                    <h3>Participants</h3>
                    {Object.keys(remoteStreams).map(userId => (
                        <div key={userId}>
                            <video
                                ref={el => { remoteVideoRefs.current[userId] = el; }}
                                autoPlay
                                playsInline
                                style={{ width: '200px' }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default VoicePage;