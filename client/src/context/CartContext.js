import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1, size, color } = action.payload;
      const key = `${product._id}-${size || ''}-${color || ''}`;
      const exists = state.items.findIndex((i) => i.key === key);
      if (exists >= 0) {
        const items = [...state.items];
        items[exists] = { ...items[exists], quantity: items[exists].quantity + quantity };
        return { ...state, items };
      }
      return { ...state, items: [...state.items, { key, product, quantity, size, color }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.key !== action.payload) };
    case 'UPDATE_QTY': {
      const { key, quantity } = action.payload;
      if (quantity <= 0) return { ...state, items: state.items.filter((i) => i.key !== key) };
      return { ...state, items: state.items.map((i) => i.key === key ? { ...i, quantity } : i) };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    case 'LOAD':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('shopwave_cart') || '[]');
      if (saved.length) dispatch({ type: 'LOAD', payload: saved });
    } catch (_) {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('shopwave_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product, quantity = 1, size, color) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, size, color } });
    toast.success(`${product.name.substring(0, 30)}... added to cart 🛍️`, { duration: 2000 });
  };

  const removeItem = (key) => dispatch({ type: 'REMOVE_ITEM', payload: key });
  const updateQty = (key, quantity) => dispatch({ type: 'UPDATE_QTY', payload: { key, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const itemCount = state.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = state.items.reduce((s, i) => s + (i.product.effectivePrice || i.product.discountPrice || i.product.price) * i.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const toOrderPayload = () => ({
    items: state.items.map((i) => ({
      product: i.product._id,
      name: i.product.name,
      image: i.product.images?.[0]?.url || '',
      price: i.product.effectivePrice || i.product.discountPrice || i.product.price,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
    })),
    itemsPrice: subtotal,
    shippingPrice: shipping,
    taxPrice: tax,
    totalPrice: total,
  });

  return (
    <CartContext.Provider value={{ items: state.items, itemCount, subtotal, shipping, tax, total, addItem, removeItem, updateQty, clearCart, toOrderPayload }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
