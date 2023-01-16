using Microsoft.AspNetCore.Mvc;

namespace RequestConverterSSR.Models
{
    public class UploadViewModel
    {
        public string FileName { get; set; }
        public IFormFile RequestBundle { set; get; }
    }
}
