import React from 'react';
import { useCart } from '../context/CartContext';

const getCartId = (item) => item?.id ?? item?._id ?? item?.sku ?? item?.name;

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotal } = useCart();

  const handleQuantityChange = (item, quantity) => {
    if (quantity > 0) {
      updateQuantity(getCartId(item), quantity);
    }
  };

  return (
    <div className="container">
      <h1>Shopping Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map(item => {
              const itemId = getCartId(item);
              return (
                <div key={itemId} className="cart-item">
                  <img src={item.image_url} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>${item.price}</p>
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(item, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item, item.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(itemId)} className="remove-btn">Remove</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cart-total">
            <h2>Total: ${getTotal().toFixed(2)}</h2>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;