using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RequestConverterAPI.Models;
using System.IO.Compression;

namespace RequestConverterAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConverterController : ControllerBase
    {
        [RequestFormLimits(ValueLengthLimit = int.MaxValue, MultipartBodyLengthLimit = int.MaxValue)]
        [HttpPost("UploadFile")]
        public IActionResult UploadFile()
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
