import { useState } from "react";
import "./appearance/App.css";
import {Sidebar} from "./components/Sidebar";
import { Channel, Message } from "./types/Interfaces";
import ChatPage from "./pages/ChatPage.tsx";
import VoicePage from "./pages/VoicePage.tsx";
import ShoppingListPage from "./pages/ShoppingListPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import Notification from "./components/Notification.tsx";
import UserProfilePage from "./pages/UserProfilePage.tsx";
import { initializeGlobalChatListeners } from "./hooks/useChatSocket";

import { invoke } from "@tauri-apps/api/core";

type CurrentView = 'home' | 'profile' | 'channel';

function App() {
  //for now hardcoded room_id
  const roomId = "9e67ea3e-6910-4c5e-9507-d0b9b1238d92";
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [currentView, setCurrentView] = useState<CurrentView>('home'); // Add view state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("User"); // Store username

  const handleLoginSuccess = (loggedInUsername: string) => {
    setIsLoggedIn(true);
    setUsername(loggedInUsername);
    //fetchChannels 
    console.log("Fetching channels for room:", roomId);
    invoke<Channel[]>("fetchChannels", { roomId })
      .then((fetchedChannels) => {
        setChannels(fetchedChannels);
        console.log("Fetched channels:", fetchedChannels);
        // Fetch messages for each channel
        const messagePromises = fetchedChannels.map(channel => 
          invoke("fetchMessages", { channelId: channel.channel_id })
            .then((messages) => {
              console.log(`Fetched messages for channel ${channel.channel_name}:`, messages);
              return { channelId: channel.channel_id, messages };
            })
            .catch((error) => {
              console.error(`Error fetching messages for channel ${channel.channel_name}:`, error);
              return { channelId: channel.channel_id, messages: [] };
            })
        );

        Promise.all(messagePromises)
        .then((channelMessages) => {
          console.log("All messages fetched:", channelMessages);
          // Initialize global chat listeners with fetched messages
          initializeGlobalChatListeners(channelMessages as { channelId: string; messages: Message[]; }[]);
        })
        .catch((error) => {
          console.error("Error fetching some messages:", error);
          // Initialize with empty messages if fetch fails
          initializeGlobalChatListeners([]);
        });
      })
      .catch((error) => {
        console.error("Error fetching channels:", error);
      });
  };

  const handleSelectChannel = (channel: Channel) => {
    setCurrentChannel(channel);
    setCurrentView('channel'); // Set view to channel when selecting a channel
  };

  const handleOpenSettings = () => {
    setCurrentView('profile'); // Switch to profile view
  };

  const handleBackToChat = () => {
    if (currentChannel) {
      setCurrentView('channel'); // Go back to current channel
    } else {
      setCurrentView('home'); // Go to home if no channel selected
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentChannel(null);
    setCurrentView('home');
    setUsername("User");
    // Add any other logout logic here
  };

  const renderPage = () => {
    // Handle different views
    switch (currentView) {
      case 'profile':
        return <UserProfilePage username={username} onBack={handleBackToChat} />;
      
      case 'channel':
        if (!currentChannel) {
          setCurrentView('home'); // Fallback to home if no channel
          return <HomePage />;
        }
        
        // Render channel-specific pages
        switch (currentChannel.channel_type) {
          case "text":
            return <ChatPage channel={currentChannel} username={username} />;
          case "voice":
            return <VoicePage channel={currentChannel} />;
          case "shopping":
            return <ShoppingListPage channel={currentChannel} />;
          default:
            return <HomePage />;
        }
      
      case 'home':
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
      <Sidebar 
        channels={channels} 
        onSelectChannel={handleSelectChannel} // Use the new handler
        onLogout={handleLogout} // Add logout handler
        onOpenSettings={handleOpenSettings} // Add settings handler
        username={username} // Pass actual username
      />
      
      <div className="content">
        {renderPage()}
      </div>
      <Notification />
    </div>
  );
}

export default App;
