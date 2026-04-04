import { useState, useEffect } from 'react';
import type { Book } from './types';

interface BookFormProps {
    book: Book | null;
    onSubmit: (book: Omit<Book, 'bookID'>) => void;
    onCancel: () => void;
}

const emptyForm = {
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
};

function BookForm({ book, onSubmit, onCancel }: BookFormProps) {
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (book) {
            setForm({
                title: book.title,
                author: book.author,
                publisher: book.publisher,
                isbn: book.isbn,
                classification: book.classification,
                category: book.category,
                pageCount: book.pageCount,
                price: book.price,
            });
        } else {
            setForm(emptyForm);
        }
    }, [book]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'pageCount' ? parseInt(value) || 0
                  : name === 'price' ? parseFloat(value) || 0
                  : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Title</label>
                    <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Author</label>
                    <input name="author" className="form-control" value={form.author} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Publisher</label>
                    <input name="publisher" className="form-control" value={form.publisher} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">ISBN</label>
                    <input name="isbn" className="form-control" value={form.isbn} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Classification</label>
                    <input name="classification" className="form-control" value={form.classification} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Category</label>
                    <input name="category" className="form-control" value={form.category} onChange={handleChange} required />
                </div>
                <div className="col-md-2">
                    <label className="form-label">Pages</label>
                    <input name="pageCount" type="number" className="form-control" value={form.pageCount} onChange={handleChange} required min="1" />
                </div>
                <div className="col-md-2">
                    <label className="form-label">Price</label>
                    <input name="price" type="number" step="0.01" className="form-control" value={form.price} onChange={handleChange} required min="0" />
                </div>
            </div>
            <div className="mt-3">
                <button type="submit" className="btn btn-success me-2">
                    {book ? 'Update Book' : 'Add Book'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default BookForm;
