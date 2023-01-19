using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting.Internal;
using RequestConverterAPI.Context;
using RequestConverterAPI.Helpers;
using RequestConverterAPI.Models;
using System.IO.Compression;
using System.Reflection;

namespace RequestConverterAPI.Controllers
{
    public class RequestController : Controller
    {
        private RequestConverterContext _context;

        public RequestController(RequestConverterContext context) { _context = context; }

        [HttpPost("Convert")]
        public IActionResult Convert(IFormFile file)
        {
            var RequestBundle = Request.Form.Files[0];
            List<IRequest> RequestList = new List<IRequest>();
            using (var stream = RequestBundle.OpenReadStream())
            using (var archive = new ZipArchive(stream))
            {
                foreach (ZipArchiveEntry entry in archive.Entries.Where(x => x.Name.Contains("_c")))
                {
                    string[] RequestSplit;

                    using (var sr = new StreamReader(entry.Open()))
                        RequestSplit = sr.ReadToEnd().Replace("\"", @"\""").Split("\r\n");

                    // Fix this to accept IRequest instead
                    if (!RequestSplit[0].Contains("CONNECT"))
                        RequestList.Add(new FiddlerRequest(RequestSplit));
                }
            }
            return RequestList.Count == 0 ? NotFound() : Ok(RequestList);
        }

        [HttpPost("Save")]
        public async Task<IActionResult> Save()
        {
            string ConversionResult = string.Empty;
            using (var sr = new StreamReader(Request.Body))
                ConversionResult = await sr.ReadToEndAsync();

            var convertedRequest = new ConvertedRequest() { Id = RandomHelper.RandomString(), ConversionResult = ConversionResult };

            _context.ConvertedRequest.Add(convertedRequest);
            _context.SaveChanges();

            if(ConversionResult != null)
                return Ok(convertedRequest.Id);
            else
                return StatusCode(500);
        }

        [HttpGet("Get")]
        public IActionResult Get(string Id)
        {
            ConvertedRequest convertedRequest = _context.Find<ConvertedRequest>(Id);

            return convertedRequest == null ? NotFound() : Ok(convertedRequest.ConversionResult);
        }       
    }
}
