using Microsoft.AspNetCore.Mvc;

namespace RequestConverterWeb.Models
{
    public class UploadViewModel
    {
        public string FileName { get; set; }
        public IFormFile RequestBundle { set; get; }
    }
}
