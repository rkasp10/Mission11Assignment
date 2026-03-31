using Microsoft.EntityFrameworkCore;
using Mission11Assignment.Server.Models;

namespace Mission11Assignment.Server.Data
{
    // EF Core context for the Bookstore SQLite database
    public class BookstoreContext : DbContext
    {
        public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options)
        {
        }

        public DbSet<Book> Books { get; set; }
    }
}
