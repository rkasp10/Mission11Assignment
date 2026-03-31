import { useState, useEffect } from 'react';
import type { Book, CartItem } from './types';
import BookList from './BookList';
import CartPage from './CartPage';

function App() {
    // Track which page to show - switching between book list and cart
    const [currentPage, setCurrentPage] = useState<'books' | 'cart'>('books');

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

    // Navigate to cart, and back to book list with "Continue Shopping"
    if (currentPage === 'cart') {
        return (
            <CartPage
                cart={cart}
                onContinueShopping={() => setCurrentPage('books')}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
            />
        );
    }

    return (
        <BookList
            cart={cart}
            onAddToCart={addToCart}
            onNavigateToCart={() => setCurrentPage('cart')}
        />
    );
}

export default App;
