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
            <form className="addItemForm"> 
                <div className="form-group">
                    <label htmlFor="itemName">Item Name:</label>
                    <input 
                        type="text" 
                        id="itemName" 
                        name="itemName" 
                        required 
                        placeholder="Enter item name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="itemQuantity">Quantity:</label>
                    <input 
                        type="number" 
                        id="itemQuantity" 
                        name="itemQuantity" 
                        required 
                        placeholder="Enter quantity"
                    />
                    <button type="submit">Add</button>
                </div>
                <button type="submit">Add Item</button>
            </form> 
        </div>
    );
}
export default ShoppingListPage;