import React from "react";
import { Channel } from "../types/Interfaces";
import { StyledWrapper } from "../appearance/ShoppingList";
import AddButton from "../components/AddButton";


interface ShoppingPageProps {
  channel: Channel;
}

function ShoppingListPage( {  }: ShoppingPageProps) {
    const [quantity, setQuantity] = React.useState(1);
    const updateQuantity = (delta: number) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };
    return (
        <div className="shopping-list-page">
            <h1>Grocery List</h1>
            <StyledWrapper>
                <div id="checklist">
                    <input name="r" type="checkbox" />
                    <label >Bread</label>
                </div>
            </StyledWrapper>

            <AddButton />
            <div className='counter'>
                <button onClick={() => updateQuantity(-1)}>-</button>
                    <p>{quantity}</p>
                <button onClick={() => updateQuantity(1)}>+</button>
            </div>
        </div>
        
    );
}
export default ShoppingListPage;