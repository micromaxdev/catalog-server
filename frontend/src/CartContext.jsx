import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => i.model_number === product.model_number);
            if (existing) {
                return prev.map((i) =>
                    i.model_number === product.model_number
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (model_number) => {
        setCartItems((prev) => prev.filter((i) => i.model_number !== model_number));
    };

    const updateQuantity = (model_number, quantity) => {
        if (quantity < 1) return;
        setCartItems((prev) =>
            prev.map((i) => (i.model_number === model_number ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => setCartItems([]);

    const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    const totalPrice = cartItems.reduce(
        (sum, i) => sum + (i.price || 0) * i.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);