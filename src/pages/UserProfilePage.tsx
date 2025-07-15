// pages/UserProfilePage.tsx
import { useState } from 'react';
import '../appearance/UserProfilePage.css';

interface UserProfilePageProps {
    username: string;
    onBack: () => void;
}

export default function UserProfilePage({ username, onBack }: UserProfilePageProps) {
    const [displayName, setDisplayName] = useState(username);
    const [email, setEmail] = useState('user@example.com');
    const [status, setStatus] = useState('online');

    const handleSave = () => {
        console.log('Saving profile changes:', { displayName, email, status });
        // Add your save logic here
    };

    return (
        <div className="user-profile-page">
            <div className="profile-header">
                <button className="back-button" onClick={onBack}>
                    ← Back
                </button>
                <h1>User Settings</h1>
            </div>
            
            <div className="profile-content">
                <div className="profile-section">
                    <h2>Profile Information</h2>
                    <div className="form-group">
                        <label htmlFor="displayName">Display Name</label>
                        <input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="online">Online</option>
                            <option value="away">Away</option>
                            <option value="busy">Busy</option>
                            <option value="invisible">Invisible</option>
                        </select>
                    </div>
                    
                    <button className="save-button" onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
                
                <div className="profile-section">
                    <h2>Appearance</h2>
                    <div className="form-group">
                        <label>Theme</label>
                        <div className="theme-options">
                            <label>
                                <input type="radio" name="theme" value="dark" defaultChecked />
                                Dark
                            </label>
                            <label>
                                <input type="radio" name="theme" value="light" />
                                Light
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}