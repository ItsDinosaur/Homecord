import { useState, useEffect } from "react";
import "./appearance/App.css";
import { Sidebar } from "./components/Sidebar";
import { Channel, Message } from "./types/Interfaces";
import ChatPage from "./pages/ChatPage.tsx";
import VoicePage from "./pages/VoicePage.tsx";
import ShoppingListPage from "./pages/ShoppingListPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import Notification from "./components/Notification.tsx";
import UserProfilePage from "./pages/UserProfilePage.tsx";
import { useChatSocket, initializeGlobalChatListeners } from "./hooks/useChatSocket";
import { wsManager } from "./hooks//websocketManager";

import { invoke } from "@tauri-apps/api/core";

type CurrentView = 'home' | 'profile' | 'channel';

function App() {
  //for now hardcoded room_id
  const roomId = "9e67ea3e-6910-4c5e-9507-d0b9b1238d92";
  // for now hardcoded userId
  const userId = "966e85df-3720-4366-9179-b0efd69ecda6"; //kai ID
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [currentView, setCurrentView] = useState<CurrentView>('home'); // Add view state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("User"); // Store username
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { connectWebSocket } = useChatSocket();

  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        await connectWebSocket(); // Don't assign if it returns void

        // Get the socket from the manager after connection
        const connectedSocket = wsManager.getWebSocket();

        if (connectedSocket) {
          console.log('WebSocket connected');
          setSocket(connectedSocket);
        } else {
          console.error('Failed to connect WebSocket');
        }
      } catch (error) {
        console.error('WebSocket connection error:', error);
      }
    };

    initializeWebSocket();
  }, []);

  const handleLoginSuccess = (loggedInUsername: string) => {
    setIsLoggedIn(true);
    setUsername(loggedInUsername); // We should create a context for UserData so we can access it globally like username, userID, settings ....

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
              return { channel_id: channel.channel_id, messages };
            })
            .catch((error) => {
              console.error(`Error fetching messages for channel ${channel.channel_name}:`, error);
              return { channel_id: channel.channel_id, messages: [] };
            })
        );

        Promise.all(messagePromises)
          .then((channelMessages) => {
            console.log("All messages fetched:", channelMessages);
            // Initialize global chat listeners with fetched messages
            initializeGlobalChatListeners(channelMessages as { channel_id: string; messages: Message[]; }[]);
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

  const handleAddChannel = (channelName: string) => {
    console.log(`Creating channel: ${channelName}`);
    // Add your channel creation logic here
    // For example:
    // invoke("createChannel", { roomId, channelName, channelType: "text" })
    //   .then((newChannel) => {
    //     setChannels([...channels, newChannel]);
    //   })
    //   .catch((error) => {
    //     console.error("Error creating channel:", error);
    //   });
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
            return socket ? (
              <VoicePage channel={currentChannel} userId={userId} ws={socket} />
            ) : (
              <div>Connecting to voice...</div>
            );
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
        onAdd={handleAddChannel} // Pass the updated handler
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
