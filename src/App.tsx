import { useState } from "react";
import "./appearance/App.css";
import {Sidebar} from "./components/Sidebar";
import { Channel } from "./types/Interfaces";
import ChatPage from "./pages/ChatPage.tsx";
import VoicePage from "./pages/VoicePage.tsx";
import ShoppingListPage from "./pages/ShoppingListPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import Notification from "./components/Notification.tsx";

import { invoke } from "@tauri-apps/api/core";

/*
const channels: Channel[] = [
  { id: "1", name: "General", type: "text" },
  { id: "2", name: "Support", type: "text" },
  { id: "3", name: "Voice Chat", type: "voice" },
  { id: "4", name: "Shopping", type: "shopping" },
];
*/

function App() {
  //for now hardcoded room_id
  const roomId = "9e67ea3e-6910-4c5e-9507-d0b9b1238d92";
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    //fetchChannels 
    console.log("Fetching channels for room:", roomId);
    invoke<Channel[]>("fetchChannels", { roomId })
      .then((fetchedChannels) => {
        setChannels(fetchedChannels);
        console.log("Fetched channels:", fetchedChannels);
      })
      .catch((error) => {
        console.error("Error fetching channels:", error);
      });
  };

  const renderPage = () => {
      if (!currentChannel) return <HomePage />;

      switch (currentChannel.channel_type) {
        case "text":
          return <ChatPage channel={currentChannel} />;
        case "voice":
          return <VoicePage channel={currentChannel} />;
        case "shopping":
          return <ShoppingListPage channel={currentChannel} />;
        default:
          return <HomePage />;
      }
    };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return (
      <div className="container">
        <LoginPage onLoginSuccess={handleLoginSuccess} />
        <Notification />
      </div>
    );
  }

  return (
    <div className="container">
      <Sidebar channels={channels} onSelectChannel={setCurrentChannel}/>
      
      <div className="content">
      {renderPage()}
      </div>
      <Notification />
    </div>
  );
}

export default App;
