// pages/UserProfilePage.tsx
import { useState } from 'react';
import '../appearance/UserProfilePage.css';
import { ColorPaletteSelector } from '../components/ColorPaletteSelector';
import { colorPalettes, applyColorPalette, getCurrentPalette, saveSelectedPalette } from '../appearance/ColorPalette';


interface UserProfilePageProps {
    username: string;
    onBack: () => void;
}

export default function UserProfilePage({ username, onBack }: UserProfilePageProps) {
    const [displayName, setDisplayName] = useState(username);
    const [email, setEmail] = useState('user@example.com');
    const [status, setStatus] = useState('online');
    const [selectedPalette, setSelectedPalette] = useState(getCurrentPalette());

    const handleSave = () => {
        console.log('Saving profile changes:', { displayName, email, status, selectedPalette });
        // Save the selected palette
        saveSelectedPalette(selectedPalette);
        const palette = colorPalettes.find(p => p.id === selectedPalette);
        if (palette) {
            applyColorPalette(palette);
        }
    };

    const handlePaletteChange = (paletteId: string) => {
        setSelectedPalette(paletteId);
        // Apply immediately for preview
        const palette = colorPalettes.find(p => p.id === paletteId);
        if (palette) {
            applyColorPalette(palette);
        }
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
                    <ColorPaletteSelector 
                        selectedPaletteId={selectedPalette}
                        onPaletteChange={handlePaletteChange}
                    />
                </div>

                <div className="profile-section">
                    <button className="save-button" onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}