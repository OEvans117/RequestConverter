using Azure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Hosting.Internal;
using Microsoft.IdentityModel.Tokens;
using RequestConverterAPI.Context;
using RequestConverterAPI.Features.Randomization;
using RequestConverterAPI.Features.RequestAnalysis;
using RequestConverterAPI.Features.RequestConversion;
using RequestConverterAPI.Models;
using RequestConverterAPI.Models.HarFile;
using RequestConverterAPI.Models.Request_Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.Dynamic;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Net.WebSockets;
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
        private RequestsFileConverter _rfc;
        private RequestAnalyser _ra;
        private static JsonSerializerOptions _jsonSerializerOptions = new JsonSerializerOptions
        {
            IncludeFields = true,
            WriteIndented = true,
        };

        public RequestController(RequestConverterContext context,
            RequestsFileConverter rfc,
            RequestAnalyser ra) { _context = context; _rfc = rfc; _ra = ra; }

        [HttpPost("Convert")]
        public IActionResult ConvertAsync(IFormFile file)
        {
            var firstFile = Request.Form.Files.FirstOrDefault();
            if (firstFile == null)
                return BadRequest();

            var RequestList = _rfc.ConvertRequestsToList(firstFile);

            var RequestListJson = JsonSerializer.Serialize(RequestList, _jsonSerializerOptions);

            // analyse request

            // _ra.AnalyseRequestBundle(RequestList, RequestListJson);

            return RequestList.Count == 0 ? NotFound() : Content(RequestListJson, "application/json");
        }

        [HttpPost("Save")]
        public async Task<IActionResult> Save()
        {
            var ConversionResult = string.Empty;
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
        public async Task<IActionResult> GetAsync([Required(AllowEmptyStrings = false)] string id)
        {
            var convertedRequest = _context.Find<ConvertedRequest>(id);
            
            if (convertedRequest == null)
                return NotFound();

            var CompressedResult = await Compression.FromBrotliAsync(value: convertedRequest.ConversionResult);

            return Ok(CompressedResult);
        }
    }
}
