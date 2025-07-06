import "../appearance/LoginPage.css";
import { Channel } from "../types/Interfaces";
import React from "react";

interface LoginPageProps {
  channel: Channel;
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
        // Here you would typically handle the login logic, e.g., sending the credentials to a server
        console.log("Logging in with", { username, password });
        // For now, just alerting the user
        alert(`Logged in as ${username}`);
        // Reset the form fields after submission
        setUsername("");
        setPassword("");
        // TESTING SOME FEATURES, MAY BE SOME STUPID THINGS HERE
        window.history.pushState({}, "", "/loggedin"); // Update the URL to reflect the home page after login
        window.dispatchEvent(new Event("popstate")); // Trigger a popstate event to update the UI if needed
        window.dispatchEvent(new Event("login")); // Custom event to notify other parts of the app about the login
        window.dispatchEvent(new Event("userLoggedIn")); // Custom event to notify other parts of the app about the user login
        window.location.href = "/sent"; // Redirect to home page after login
        // Optionally, redirect to another page or update the UI
        // window.location.href = "/home"; // Example redirect
        // or you can use a state management solution to update the app state
        // e.g., setCurrentUser({ username });
        // Note: In a real application, you would not log credentials to the console or use
        // alert for sensitive information. Instead, you would send them securely to a backend service.
        // Also, consider using HTTPS for secure communication.
        // If you want to handle user creation, you can implement that logic here as well.
        // For example, you could call an API to create a new user with the provided username
        // and password, and then handle the response accordingly.
        // For now, we will just alert that the user creation functionality is not implemented.
        alert("Create User functionality not implemented yet");
        // You can also redirect to a user creation page or show a modal for user creation.
        // window.location.href = "/create-user"; // Example redirect to user creation page
        // or you can show a modal for user creation
        // e.g., setShowCreateUserModal(true);
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