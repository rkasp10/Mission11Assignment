import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Book, CartItem } from './types';

// Shape of the cart context that all components can access
interface CartContextType {
    cart: CartItem[];
    addToCart: (book: Book) => void;
    updateQuantity: (bookID: number, quantity: number) => void;
    removeItem: (bookID: number) => void;
    cartItemCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider that wraps the app and makes cart state available everywhere
export function CartProvider({ children }: { children: ReactNode }) {
    // Load cart from sessionStorage so it persists across refreshes
    const [cart, setCart] = useState<CartItem[]>(() => {
        const saved = sessionStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    // Save cart to sessionStorage whenever it changes
    useEffect(() => {
        sessionStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (book: Book) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.book.bookID === book.bookID);
            if (existing) {
                // Increase quantity if the book is already in the cart
                return prev.map((item) =>
                    item.book.bookID === book.bookID
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { book, quantity: 1 }];
        });
    };

    const updateQuantity = (bookID: number, quantity: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.book.bookID === bookID ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    };

    // Filter out the removed book from the cart
    const removeItem = (bookID: number) => {
        setCart((prev) => prev.filter((item) => item.book.bookID !== bookID));
    };

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, cartItemCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

// Hook so any component can access the cart
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
