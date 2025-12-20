import React, { useEffect, useState } from "react";
import CartService from "../services/dashboard/CartService";
import { FaBan } from "react-icons/fa";

const CartComponent = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load initial cart items from the CartService
    setCartItems(CartService.getCart());
  }, []);

  const addItem = async () => {
    const newProduct = { id: Date.now(), name: 'New Product', price: 9.99, quantity:1 };
    CartService.addToCart(newProduct);
    setCartItems([...CartService.getCart()]);
  };

  const removeItem = (id) => {
    CartService.removeFromCart(id);
    setCartItems(CartService.getCart());
  };

  const clearCart = () => {
    CartService.clearCart();
    setCartItems([]);
  };

  return (
    <div>
      <h5>Shopping Cart ({cartItems.length})</h5>
      {cartItems.length === 0 ? (
        <p className="alert alert-secondary border border-secondary text-muted text-center"><FaBan/> Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} (x{item.quantity})
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      
      <button onClick={addItem}>Add New Item</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

export default CartComponent;
