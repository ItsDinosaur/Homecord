import React from "react";
import { Channel } from "../types/Interfaces";
import "../appearance/ShoppingList.css";

interface ShoppingPageProps {
  channel: Channel;
}

function ShoppingListPage( { channel }: ShoppingPageProps) {
    return (
        <div className="shopping-list-page">
            <h1>Grocery List</h1>
             <div id="checklist">
                <input id="01" type="checkbox" name="r" value="1" />
                <label >Bread</label>
                <input id="02" type="checkbox" name="r" value="2" />
                <label >Cheese</label>
                <input id="03" type="checkbox" name="r" value="3" />
                <label >Coffee</label>
                <input id="04" type="checkbox" name="r" value="4" />
                <label >Eggs</label>
                <input id="05" type="checkbox" name="r" value="5"
                />
                <label >Milk</label>
                <input id="06" type="checkbox" name="r" value="6"
                />
                <label >Pasta</label>
                <input id="07" type="checkbox" name="r" value="7"
                />
                <label >Rice</label>
                <input id="08" type="checkbox" name="r" value="8"
                />
                <label >Tomatoes</label>
            </div>
        </div>
    );
}
export default ShoppingListPage;