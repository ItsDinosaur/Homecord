import "../appearance/LoginPage.css";
import { Channel, LoginResponse } from "../types/Interfaces";
import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "react-toastify";
import { useChatSocket, initializeGlobalChatListeners } from "../hooks/useChatSocket";

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
}

function LoginPage( { onLoginSuccess }: LoginPageProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { connectWebSocket } = useChatSocket(); // This will NOT initialize global listeners automatically

    const handleSubmit = (e: React.FormEvent) => {
        //debug
        if (username === "debug" || password === "debug") {
            onLoginSuccess(username);
            return;
        }

        e.preventDefault();
        invoke<LoginResponse>("login", { username, password })
            .then((response) => {
                console.log("Login response:", response);
                toast.success("You are logged in as " + username);
                // Store tokens and wait for completion
                return invoke("store_tokens", {
                    accessToken: response.access_token,
                    refreshToken: response.refresh_token
                });
            })
            .then(() => {
                console.log("Tokens stored successfully");
                // Connect WebSocket first
                return connectWebSocket();
            })
            .then(() => {
                onLoginSuccess(username);
            })
            .catch((error) => {
                console.error("Error during login/storage process:", error);
                toast.error("Error: " + error);
            });
    };

    return (
        <div className="login-page">
            <h1>Login Page</h1>
            <div className="login-content">
                <form onSubmit={handleSubmit} className="login-form"> 
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            required 
                            value = {username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            className="input"
                        />
                        <input type="password" 
                            id="password" 
                            name="password" 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Enter password"
                            className="input"
                        />
                    <button type="submit">Login</button>
                    <button type="button" onClick={() => alert("Create User functionality not implemented yet")}>
                        Create User
                    </button>
                </form>
            </div>
        </div>
    );
    }
export default LoginPage;