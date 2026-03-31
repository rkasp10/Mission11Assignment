import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

// Full cart page showing all items with quantity, subtotal, and total
function CartPage() {
    const navigate = useNavigate();
    const { cart, updateQuantity, removeItem, cartTotal } = useCart();

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-dark">Shopping Cart</h1>

            {cart.length === 0 ? (
                <div className="text-center">
                    <p className="text-muted fs-5">Your cart is empty.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Title</th>
                                <th>Price</th>
                                <th style={{ width: '120px' }}>Quantity</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => (
                                <tr key={item.book.bookID}>
                                    <td>
                                        <strong>{item.book.title}</strong>
                                        <br />
                                        <small className="text-muted">{item.book.author}</small>
                                    </td>
                                    <td>${item.book.price.toFixed(2)}</td>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.book.bookID, parseInt(e.target.value) || 1)}
                                        />
                                    </td>
                                    <td>${(item.book.price * item.quantity).toFixed(2)}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item.book.bookID)}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="row">
                        <div className="col-md-6">
                            <button className="btn btn-outline-primary" onClick={() => navigate('/')}>
                                Continue Shopping
                            </button>
                        </div>
                        <div className="col-md-6 text-end">
                            {/* Grand total for all items */}
                            <h4>Total: ${cartTotal.toFixed(2)}</h4>
                            <button className="btn btn-success btn-lg mt-2">
                                Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartPage;
