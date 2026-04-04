import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import BookList from './BookList';
import CartPage from './CartPage';
import AdminBooks from './AdminBooks';

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<BookList />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/adminbooks" element={<AdminBooks />} />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
}

export default App;
