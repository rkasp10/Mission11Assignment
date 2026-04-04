using Microsoft.AspNetCore.Mvc;
using Mission11Assignment.Server.Data;
using Mission11Assignment.Server.Models;

namespace Mission11Assignment.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _context;

        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        // GET /api/books?pageNumber=1&pageSize=5&sortBy=title&category=Biography
        [HttpGet]
        public IActionResult GetBooks(int pageNumber = 1, int pageSize = 5, string sortBy = "", string category = "")
        {
            var query = _context.Books.AsQueryable();

            // Filter by category if one is selected
            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(b => b.Category == category);
            }

            // Sort alphabetically by title if requested
            if (sortBy.Equals("title", StringComparison.OrdinalIgnoreCase))
            {
                query = query.OrderBy(b => b.Title);
            }

            var totalBooks = query.Count();

            // Skip/Take for pagination
            var books = query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Send back the books plus pagination info for the frontend
            return Ok(new
            {
                books,
                totalBooks,
                totalPages = (int)Math.Ceiling((double)totalBooks / pageSize),
                currentPage = pageNumber,
                pageSize
            });
        }

        // Returns all unique categories for the filter sidebar
        [HttpGet("categories")]
        public IActionResult GetCategories()
        {
            var categories = _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            return Ok(categories);
        }

        // POST /api/books
        [HttpPost]
        public IActionResult AddBook([FromBody] Book book)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Books.Add(book);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetBooks), new { id = book.BookID }, book);
        }

        // PUT /api/books/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateBook(int id, [FromBody] Book book)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existing = _context.Books.Find(id);
            if (existing == null)
                return NotFound();

            existing.Title = book.Title;
            existing.Author = book.Author;
            existing.Publisher = book.Publisher;
            existing.ISBN = book.ISBN;
            existing.Classification = book.Classification;
            existing.Category = book.Category;
            existing.PageCount = book.PageCount;
            existing.Price = book.Price;

            _context.SaveChanges();

            return Ok(existing);
        }

        // DELETE /api/books/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteBook(int id)
        {
            var book = _context.Books.Find(id);
            if (book == null)
                return NotFound();

            _context.Books.Remove(book);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
