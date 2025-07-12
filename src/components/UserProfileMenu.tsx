import React, { useRef, useEffect } from "react";
import '../appearance/UserProfileMenu.css';

interface UserProfileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
    onSettings: () => void;
    username?: string;
}

export function UserProfileMenu({ isOpen, onClose, onLogout, onSettings, username = "User" }: UserProfileMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    //Close the menu when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="user-profile-menu" ref={menuRef}>
            <div className="menu-header">
                <span className="username">{username}</span>
                <span className="status-indicator online"></span>
            </div>
            <div className="menu-divider"></div>
            <div className="menu-options">
                <button className="menu-option" onClick={onSettings}>
                    <span className="option-icon">⚙️</span>
                    Settings
                </button>
                <button className="menu-option" onClick={() => window.open('https://github.com/your-repo', '_blank')}>
                    <span className="option-icon">📖</span>
                    Help & Support
                </button>
                <div className="menu-divider"></div>
                <button className="menu-option logout" onClick={onLogout}>
                    <span className="option-icon">🚪</span>
                    Logout
                </button>
            </div>
        </div>
    )
}