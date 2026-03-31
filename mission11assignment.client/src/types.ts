// Shared types used across components

export interface Book {
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

export interface BooksResponse {
    books: Book[];
    totalBooks: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

export interface CartItem {
    book: Book;
    quantity: number;
}
