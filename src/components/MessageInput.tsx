import "../appearance/MessageInput.css";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function MessageInput() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload
    if (message.trim() === "") return; // Prevent sending empty messages
    setMessage(""); // Clear the input
    window.history.pushState({}, "", "/sent");    //to test window redirection from login page, may be deleted later
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button type="submit">Send</button>
    </form>
  );
}
export default MessageInput;