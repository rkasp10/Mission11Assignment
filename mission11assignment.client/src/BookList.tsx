import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book, BooksResponse } from './types';
import { useCart } from './CartContext';
import CartToast from './CartToast';
import CartOffcanvas from './CartOffcanvas';

function BookList() {
    const navigate = useNavigate();
    const { cart, addToCart, cartItemCount } = useCart();

    const [data, setData] = useState<BooksResponse | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(5); // default to 5 per page
    const [sortByTitle, setSortByTitle] = useState(false);
    const [loading, setLoading] = useState(true);

    // Category filter state
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    // Toast notification state
    const [toastBook, setToastBook] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Offcanvas cart summary state
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    // Load the list of categories once on mount
    useEffect(() => {
        fetch('/api/books/categories')
            .then((res) => res.json())
            .then((cats: string[]) => setCategories(cats))
            .catch(() => {});
    }, []);

    // Fetch books whenever page, size, sort, or category changes
    useEffect(() => {
        setLoading(true);
        const sortParam = sortByTitle ? '&sortBy=title' : '';
        const catParam = selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : '';
        fetch(`/api/books?pageNumber=${pageNumber}&pageSize=${pageSize}${sortParam}${catParam}`)
            .then((res) => res.json())
            .then((result: BooksResponse) => {
                setData(result);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [pageNumber, pageSize, sortByTitle, selectedCategory]);

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        setPageNumber(1); // reset to page 1 when filtering
    };

    // Reset to page 1 when changing how many results to show
    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setPageNumber(1);
    };

    const handleAddToCart = (book: Book) => {
        addToCart(book);
        setToastBook(book.title);
        setShowToast(true);
    };

    return (
        <div className="container-fluid mt-4 px-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-dark mb-0">Hilton's Bookstore</h1>
                {/* Cart button that opens the offcanvas summary */}
                <button className="btn btn-outline-dark position-relative" onClick={() => setShowOffcanvas(true)}>
                    Cart
                    {cartItemCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cartItemCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Bootstrap Grid: sidebar for categories, main area for books */}
            <div className="row">
                <div className="col-md-2">
                    <h5 className="fw-bold">Categories</h5>
                    <div className="list-group mb-3">
                        <button
                            className={`list-group-item list-group-item-action ${selectedCategory === '' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('')}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`list-group-item list-group-item-action ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="col-md-10">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <label className="me-2 fw-bold">Results per page:</label>
                            {[5, 10, 15].map((size) => (
                                <button
                                    key={size}
                                    className={`btn btn-sm me-1 ${pageSize === size ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handlePageSizeChange(size)}
                                >
                                    {size}
                                </button>
                            ))}
                            {data && (
                                <button
                                    className={`btn btn-sm me-1 ${pageSize === data.totalBooks ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handlePageSizeChange(data.totalBooks)}
                                >
                                    All
                                </button>
                            )}
                        </div>
                        <div>
                            <button
                                className={`btn btn-sm ${sortByTitle ? 'btn-success' : 'btn-outline-secondary'}`}
                                onClick={() => { setSortByTitle(!sortByTitle); setPageNumber(1); }}
                            >
                                {sortByTitle ? 'Sorted by Title ✓' : 'Sort by Title'}
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-center mt-4">Loading books...</p>
                    ) : !data || data.books.length === 0 ? (
                        <p className="text-center mt-4">No books found.</p>
                    ) : (
                        <>
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Publisher</th>
                                        <th>ISBN</th>
                                        <th>Classification</th>
                                        <th>Category</th>
                                        <th>Pages</th>
                                        <th>Price</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.books.map((book) => (
                                        <tr key={book.bookID}>
                                            <td>{book.title}</td>
                                            <td>{book.author}</td>
                                            <td>{book.publisher}</td>
                                            <td>{book.isbn}</td>
                                            <td>{book.classification}</td>
                                            <td>{book.category}</td>
                                            <td>{book.pageCount}</td>
                                            <td>${book.price.toFixed(2)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    onClick={() => handleAddToCart(book)}
                                                >
                                                    Add to Cart
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <nav>
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${pageNumber === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setPageNumber(pageNumber - 1)}>
                                            Previous
                                        </button>
                                    </li>
                                    {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
                                        <li key={page} className={`page-item ${page === pageNumber ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => setPageNumber(page)}>
                                                {page}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${pageNumber === data.totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setPageNumber(pageNumber + 1)}>
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>

                            <p className="text-center text-muted">
                                Showing {(data.currentPage - 1) * data.pageSize + 1}–
                                {Math.min(data.currentPage * data.pageSize, data.totalBooks)} of {data.totalBooks} books
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Toast notification for add-to-cart */}
            <CartToast bookTitle={toastBook} show={showToast} onClose={() => setShowToast(false)} />

            {/* Offcanvas slide-in cart summary */}
            <CartOffcanvas
                show={showOffcanvas}
                onClose={() => setShowOffcanvas(false)}
                onViewCart={() => { setShowOffcanvas(false); navigate('/cart'); }}
            />
        </div>
    );
}

export default BookList;
