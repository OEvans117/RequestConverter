using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RequestConverterAPI.Models
{
    public class ConvertedRequest
    {
        [Key]
        public string Id { get; set; }

        [Required]
        public string ConversionResult { get; set; }
    }
}
