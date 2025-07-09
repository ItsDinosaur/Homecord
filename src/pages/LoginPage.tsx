import "../appearance/LoginPage.css";
import { Channel } from "../types/Interfaces";
import React from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "react-toastify";

interface LoginPageProps {
  channel: Channel;
}


function LoginPage({ channel }: LoginPageProps) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevents page reload - also seems to prevent the actual efect of login but also prevents url from containing plain login and password
        if (username.trim() === "" || password.trim() === "") {
            toast.warn("Username and password cannot be empty");
            return;
        }
        invoke("login", { username, password })
            .then((response) => {
                toast.success("You are logged in as " + username);
            }
        )
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