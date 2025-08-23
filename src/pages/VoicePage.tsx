import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Channel } from "../types/Interfaces";

// Fake users for now — later will come from WebRTC
interface Participant {
  id: string;
  name: string;
  videoEnabled: boolean;
  audioEnabled: boolean;
}

interface VoicePageProps {
  channel: Channel;
  ws: WebSocket;
}

export default function VoicePage({ channel, ws }: VoicePageProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  // Auto connect when page loads
  useEffect(() => {
    invoke("start_call", { channel})
      .then(() => console.log("Connected to call"))
      .catch(console.error);

  }, [channel]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <div
        className="grid grid-cols-3 grid-rows-3 gap-6 transform rotate-45"
        style={{ width: "80%", height: "80%" }}
      >
        {/* Fill with 4 slots in diamond shape */}
        <div className="col-start-2 row-start-1 flex items-center justify-center">
          {renderSlot(participants[0])}
        </div>
        <div className="col-start-1 row-start-2 flex items-center justify-center">
          {renderSlot(participants[1])}
        </div>
        <div className="col-start-3 row-start-2 flex items-center justify-center">
          {renderSlot(participants[2])}
        </div>
        <div className="col-start-2 row-start-3 flex items-center justify-center">
          {renderSlot(participants[3])}
        </div>
      </div>
    </div>
  );
}

// Helper to render a participant box
function renderSlot(user?: Participant) {
  if (!user) {
    return (
      <div className="w-32 h-32 rounded-xl bg-gray-700 flex items-center justify-center transform -rotate-45">
        <span className="text-gray-400">Empty</span>
      </div>
    );
  }

  return (
    <div className="w-32 h-32 rounded-xl bg-gray-800 text-white flex items-center justify-center transform -rotate-45">
      {user.videoEnabled ? (
        <video
          autoPlay
          playsInline
          muted={!user.audioEnabled}
          className="w-full h-full object-cover rounded-xl"
        />
      ) : (
        <span className="text-lg">{user.name}</span>
      )}
    </div>
  );
}
