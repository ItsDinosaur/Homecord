import "../appearance/LoginPage.css";
import { Channel } from "../types/Interfaces";

interface LoginPageProps {
  channel: Channel;
}

function LoginPage({ channel }: LoginPageProps) {
    return (
        <div className="login-page">
            <h1>Login Page</h1>
            <p>This is the login page where you can create a user or log in as one.</p>
            <div className="login-content">
                <form>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" required />
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