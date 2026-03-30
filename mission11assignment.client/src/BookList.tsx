import { useEffect, useState } from 'react';

interface Book {
    bookID: number;
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    classification: string;
    category: string;
    pageCount: number;
    price: number;
}

interface BooksResponse {
    books: Book[];
    totalBooks: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

function BookList() {
    const [data, setData] = useState<BooksResponse | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(5); // default to 5 per page
    const [sortByTitle, setSortByTitle] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch books from the API whenever page, size, or sort changes
    useEffect(() => {
        setLoading(true);
        const sortParam = sortByTitle ? '&sortBy=title' : '';
        fetch(`/api/books?pageNumber=${pageNumber}&pageSize=${pageSize}${sortParam}`)
            .then((res) => res.json())
            .then((result: BooksResponse) => {
                setData(result);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [pageNumber, pageSize, sortByTitle]);

    if (loading) {
        return <p className="text-center mt-4">Loading books...</p>;
    }

    if (!data || data.books.length === 0) {
        return <p className="text-center mt-4">No books found.</p>;
    }

    // Reset to page 1 when changing how many results to show
    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setPageNumber(1);
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-dark">Hilton's Bookstore</h1>

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
                    <button
                        className={`btn btn-sm me-1 ${pageSize === data.totalBooks ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handlePageSizeChange(data.totalBooks)}
                    >
                        All
                    </button>
                </div>
                <div>
                    <button
                        className={`btn btn-sm ${sortByTitle ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => {
                            setSortByTitle(!sortByTitle);
                            setPageNumber(1);
                        }}
                    >
                        {sortByTitle ? 'Sorted by Title ✓' : 'Sort by Title'}
                    </button>
                </div>
            </div>

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
        </div>
    );
}

export default BookList;
