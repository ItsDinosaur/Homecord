import "../appearance/MessageInput.css";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function MessageInput() {
  const [message, setMessage] = useState("");

  return (
    <form className="message-input">
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