using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Hosting.Internal;
using RequestConverterAPI.Context;
using RequestConverterAPI.Helpers;
using RequestConverterAPI.Models;
using RequestConverterAPI.Models.HarFile;
using RequestConverterAPI.Models.Request_Models;
using System;
using System.Dynamic;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Reflection;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace RequestConverterAPI.Controllers
{
    public class RequestController : Controller
    {
        private RequestConverterContext _context;

        public RequestController(RequestConverterContext context) { _context = context; }

        [HttpPost("Convert")]
        public IActionResult ConvertAsync(IFormFile file)
        {
            var RequestBundle = Request.Form.Files[0];

            List<IRequest> RequestList = new List<IRequest>();

            string PathExtension = Path.GetExtension(RequestBundle.FileName);

            if (PathExtension == ".saz")
            {
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
            }

            if(PathExtension == ".har")
            {
                using (var stream = RequestBundle.OpenReadStream())
                using (var sr = new StreamReader(stream))
                {
                    var JSONData = JsonSerializer.Deserialize<HarJson>(sr.ReadToEnd());

                    if(JSONData != null)
                        foreach (var entry in JSONData.Log.Entries)
                            RequestList.Add(new HarRequest(entry));
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

            var CompressedResult = await Compression.ToBrotliAsync(ConversionResult ,CompressionLevel.SmallestSize);

            var convertedRequest = new ConvertedRequest() { Id = RandomHelper.RandomString(), ConversionResult = CompressedResult.Result.Value };

            _context.ConvertedRequest.Add(convertedRequest);
            _context.SaveChanges();

            if(ConversionResult != null)
                return Ok(convertedRequest.Id);
            else
                return StatusCode(500);
        }

        [HttpGet("Get")]
        public async Task<IActionResult> GetAsync(string Id)
        {
            ConvertedRequest convertedRequest = _context.Find<ConvertedRequest>(Id);

            var CompressedResult = await Compression.FromBrotliAsync(value: convertedRequest.ConversionResult);

            return convertedRequest == null ? NotFound() : Ok(CompressedResult);
        }
    }
}
