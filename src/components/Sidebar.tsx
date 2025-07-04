import { useState } from "react";

import "../pages/Sidebar.css";

function Sidebar() {
    
    
    return (
        <div className={`sidebar`}>
        <nav className="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
        </nav>
        </div>
    );
}

export default Sidebar;