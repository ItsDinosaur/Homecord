import "../appearance/LoginPage.css";
import { Channel } from "../types/Interfaces";
import React from "react";
import { invoke } from "@tauri-apps/api/core";

interface LoginPageProps {
  channel: Channel;
}

async function login(username: string, password: string) {
  try {
    const response = await invoke("login", { username, password });
    console.log("Login successful:", response);
  } catch (error) {
    console.error("Login failed:", error);
  }
}

function LoginPage({ channel }: LoginPageProps) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevents page reload - also seems to prevent the actual efect of login but also prevents url from containing plain login and password
        if (username.trim() === "" || password.trim() === "") {
            alert("Username and password cannot be empty");
            return;
        }
        login(username, password);




        /*
        // TESTING SOME FEATURES, MAY BE SOME STUPID THINGS HERE
        window.history.pushState({}, "", "/loggedin"); // Update the URL to reflect the home page after login
        window.dispatchEvent(new Event("popstate")); // Trigger a popstate event to update the UI if needed
        window.dispatchEvent(new Event("login")); // Custom event to notify other parts of the app about the login
        window.dispatchEvent(new Event("userLoggedIn")); // Custom event to notify other parts of the app about the user login
        window.location.href = "/sent"; // Redirect to home page after login
        */
    };

    return (
        <div className="login-page">
            <h1>Login Page</h1>
            <p>This is the login page where you can create a user or log in as one.</p>
            <div className="login-content">
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            required 
                            value = {username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" 
                            id="password" 
                            name="password" 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Enter password"
                        />
                    </div>
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