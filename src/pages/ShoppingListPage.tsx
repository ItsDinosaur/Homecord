import React from "react";
import { Channel } from "../types/Interfaces";

interface ShoppingPageProps {
  channel: Channel;
}

function ShoppingListPage( { channel }: ShoppingPageProps) {
    return (
        <div className="shopping-list-page">
            <h1>Shopping List Page</h1>
            <p>This is the shopping list page where users can manage their shopping items.</p>
            {/* Add more components or content as needed */}
        </div>
    );
}
export default ShoppingListPage;