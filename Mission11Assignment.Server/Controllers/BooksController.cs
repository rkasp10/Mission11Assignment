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

        // GET /api/books?pageNumber=1&pageSize=5&sortBy=title
        [HttpGet]
        public IActionResult GetBooks(int pageNumber = 1, int pageSize = 5, string sortBy = "")
        {
            var query = _context.Books.AsQueryable();

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
    }
}
