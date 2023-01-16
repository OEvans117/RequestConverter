using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting.Internal;
using Newtonsoft.Json;
using RequestConverterAPI.Models;
using System.IO.Compression;
using System.Reflection;

namespace RequestConverterAPI.Controllers
{
    public class UploadController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("UploadFile")]
        public IActionResult UploadFile(IFormFile file)
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
    }
}
