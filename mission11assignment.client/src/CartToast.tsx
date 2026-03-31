import { useEffect } from 'react';

// Bootstrap Toast that pops up when a book is added to the cart
function CartToast({ bookTitle, show, onClose }: { bookTitle: string; show: boolean; onClose: () => void }) {
    // Auto-dismiss after 3 seconds
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
            <div className="toast show border-success" role="alert">
                <div className="toast-header bg-success text-white">
                    <strong className="me-auto">Added to Cart</strong>
                    <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                </div>
                <div className="toast-body">
                    <strong>{bookTitle}</strong> has been added to your cart.
                </div>
            </div>
        </div>
    );
}

export default CartToast;
