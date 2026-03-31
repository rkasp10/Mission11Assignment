import type { CartItem } from './types';

// Bootstrap Offcanvas slide-in panel that shows a quick cart summary
function CartOffcanvas({ cart, show, onClose, onViewCart }: {
    cart: CartItem[];
    show: boolean;
    onClose: () => void;
    onViewCart: () => void;
}) {
    // Totals for the summary display
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

    return (
        <>
            {/* Backdrop */}
            {show && <div className="offcanvas-backdrop fade show" onClick={onClose}></div>}

            <div className={`offcanvas offcanvas-end ${show ? 'show' : ''}`}
                style={{ visibility: show ? 'visible' : 'hidden' }}
                tabIndex={-1}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Cart Summary</h5>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <div className="offcanvas-body">
                    {cart.length === 0 ? (
                        <p className="text-muted">Your cart is empty.</p>
                    ) : (
                        <>
                            {cart.map((item) => (
                                <div key={item.book.bookID} className="d-flex justify-content-between mb-2">
                                    <div>
                                        <strong>{item.book.title}</strong>
                                        <br />
                                        <small className="text-muted">Qty: {item.quantity}</small>
                                    </div>
                                    <div className="text-end">
                                        ${(item.book.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between fw-bold">
                                <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
                                <span>Total: ${totalPrice.toFixed(2)}</span>
                            </div>
                            <button className="btn btn-primary w-100 mt-3" onClick={onViewCart}>
                                View Full Cart
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default CartOffcanvas;
