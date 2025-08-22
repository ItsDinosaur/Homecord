import "../appearance/LoginPage.css";
import { LoginResponse } from "../types/Interfaces";
import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "react-toastify";
import login_background from "../assets/login_background.jpg";


interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
}

function LoginPage( { onLoginSuccess }: LoginPageProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
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
            })
            .then(() => {
                onLoginSuccess(username);
            })
            .catch((error) => {
                console.error("Error during login/storage process:", error);
                toast.error("Error: " + error);
            });
    };
    const handleCreateAccount = (e: React.FormEvent) => {
        e.preventDefault();
        /*
        invoke<LoginResponse>("create_account", { username, password })
            .then((response) => {
                console.log("Create account response:", response);
                toast.success("Account created successfully");
                onLoginSuccess(username);
            })
            .catch((error) => {
                console.error("Error during account creation:", error);
                toast.error("Error: " + error);
            });
        */
       toast.info("Account creation is not available yet.");
    };

    return (
        <div className="login-page"
        style={{
            backgroundImage: `url(${login_background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }}>
        <h1 className="logo">Homecord</h1>
        <div className="login-content">
        <div className="card">
            <div className="inputBox">
                <input type="text" required={true}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                ></input>
                <span className="user">Username</span>
            </div>
            <div className="inputBox">
                <input type="password" required={true}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ></input> 
                <span>Password</span>
            </div>
            <button className="enter" onClick={handleLogin}>Log in</button>
            <button className="enter" onClick={handleCreateAccount}>Create account</button>
        </div>
        </div>
        </div>
    );
}
export default LoginPage;