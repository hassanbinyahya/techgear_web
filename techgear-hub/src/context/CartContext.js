import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

const CartContext = createContext();

const getCartId = (item) => item?.id ?? item?._id ?? item?.sku ?? item?.name;

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const cartId = getCartId(action.payload);
      const existingItem = state.items.find(item => getCartId(item) === cartId);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            getCartId(item) === cartId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1, id: cartId }],
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => getCartId(item) !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          getCartId(item) === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => {
      setToast(null);
    }, 2200);

    return () => clearTimeout(timer);
  }, [toast]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    setToast('Your product added successfully');
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const hideToast = () => setToast(null);

  return (
    <CartContext.Provider value={{
      items: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      toast,
      hideToast,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};