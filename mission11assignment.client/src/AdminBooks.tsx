import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book, BooksResponse } from './types';
import BookForm from './BookForm';

function AdminBooks() {
    const navigate = useNavigate();
    const [data, setData] = useState<BooksResponse | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(true);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [showForm, setShowForm] = useState(false);

    const fetchBooks = () => {
        setLoading(true);
        fetch(`/api/books?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=title`)
            .then((res) => res.json())
            .then((result: BooksResponse) => {
                setData(result);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchBooks();
    }, [pageNumber, pageSize]);

    const handleAdd = (book: Omit<Book, 'bookID'>) => {
        fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to add');
                setShowForm(false);
                setEditingBook(null);
                fetchBooks();
            })
            .catch((err) => alert(err.message));
    };

    const handleUpdate = (book: Omit<Book, 'bookID'>) => {
        if (!editingBook) return;
        fetch(`/api/books/${editingBook.bookID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...book, bookID: editingBook.bookID }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to update');
                setShowForm(false);
                setEditingBook(null);
                fetchBooks();
            })
            .catch((err) => alert(err.message));
    };

    const handleDelete = (bookID: number, title: string) => {
        if (!confirm(`Delete "${title}"?`)) return;
        fetch(`/api/books/${bookID}`, { method: 'DELETE' })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to delete');
                fetchBooks();
            })
            .catch((err) => alert(err.message));
    };

    const openAddForm = () => {
        setEditingBook(null);
        setShowForm(true);
    };

    const openEditForm = (book: Book) => {
        setEditingBook(book);
        setShowForm(true);
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingBook(null);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-dark mb-0">Manage Books</h1>
                <div>
                    <button className="btn btn-outline-primary me-2" onClick={() => navigate('/')}>
                        Back to Store
                    </button>
                    <button className="btn btn-success" onClick={openAddForm}>
                        + Add Book
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="card mb-4">
                    <div className="card-header bg-dark text-white">
                        {editingBook ? `Editing: ${editingBook.title}` : 'Add New Book'}
                    </div>
                    <div className="card-body">
                        <BookForm
                            book={editingBook}
                            onSubmit={editingBook ? handleUpdate : handleAdd}
                            onCancel={cancelForm}
                        />
                    </div>
                </div>
            )}

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
                                <th>Category</th>
                                <th>ISBN</th>
                                <th>Price</th>
                                <th style={{ width: '160px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.books.map((book) => (
                                <tr key={book.bookID}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.category}</td>
                                    <td>{book.isbn}</td>
                                    <td>${book.price.toFixed(2)}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary me-1"
                                            onClick={() => openEditForm(book)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(book.bookID, book.title)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <label className="me-2 fw-bold">Per page:</label>
                            {[10, 25, 50].map((size) => (
                                <button
                                    key={size}
                                    className={`btn btn-sm me-1 ${pageSize === size ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => { setPageSize(size); setPageNumber(1); }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        <nav>
                            <ul className="pagination mb-0">
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
                    </div>

                    <p className="text-center text-muted mt-2">
                        Showing {(data.currentPage - 1) * data.pageSize + 1}–
                        {Math.min(data.currentPage * data.pageSize, data.totalBooks)} of {data.totalBooks} books
                    </p>
                </>
            )}
        </div>
    );
}

export default AdminBooks;
