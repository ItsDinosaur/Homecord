import React, { useRef, useEffect, useState } from "react";
import '../appearance/AddChannelMenu.css';

interface AddChannelMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (channelName: string) => void; // Update to accept channel name
}

export function AddChannelMenu({ isOpen, onClose, onAdd }: AddChannelMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [channelName, setChannelName] = useState("");

    // Close the menu when clicking outside of it
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

    // Focus input when menu opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (channelName.trim()) {
            onAdd(channelName.trim());
            setChannelName(""); // Clear input after adding
            onClose(); // Close menu after adding
        }
    };

    // Handle Escape key to close menu
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="add-channel-menu" ref={menuRef}>
            <div className="menu-header">
                <h3>Create Channel</h3>
            </div>
            <form onSubmit={handleSubmit} className="add-channel-form">
                <div className="input-group">
                    <label htmlFor="channelName">Channel Name</label>
                    <input
                        ref={inputRef}
                        id="channelName"
                        type="text"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter channel name..."
                        maxLength={50}
                        required
                    />
                </div>
                <div className="menu-options">
                    <button 
                        type="submit" 
                        className="menu-option primary"
                        disabled={!channelName.trim()}
                    >
                        <span className="add-channel-icon">➕</span>
                        Create Channel
                    </button>
                    <button 
                        type="button" 
                        className="menu-option secondary" 
                        onClick={onClose}
                    >
                        <span className="cancel-icon">✕</span>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}