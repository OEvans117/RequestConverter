using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using RequestConverterAPI.Models;

namespace RequestConverterAPI.Context
{
    public class RequestConverterContext : DbContext
    {
        public RequestConverterContext(DbContextOptions options) : base(options) { }

        public DbSet<ConvertedRequest> ConvertedRequest { get; set; }
    }
}
