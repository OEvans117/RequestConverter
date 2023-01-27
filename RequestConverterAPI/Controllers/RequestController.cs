using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Hosting.Internal;
using RequestConverterAPI.Context;
using RequestConverterAPI.Features.Randomization;
using RequestConverterAPI.Features.RequestAnalysis;
using RequestConverterAPI.Features.RequestConversion;
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
        private RequestsFileConverter _rfc;
        private RequestAnalyser _ra;

        public RequestController(RequestConverterContext context,
            RequestsFileConverter rfc,
            RequestAnalyser ra) { _context = context; _rfc = rfc; _ra = ra; }

        [HttpPost("Convert")]
        public IActionResult ConvertAsync(IFormFile file)
        {
            var RequestList = _rfc.ConvertRequestsToList(Request.Form.Files[0]);

            var RequestListJson = JsonSerializer.Serialize(RequestList, new JsonSerializerOptions { 
                IncludeFields = true, 
                WriteIndented = true,
            });

            // analyse request

            // _ra.AnalyseRequestBundle(RequestList, RequestListJson);

            return RequestList.Count == 0 ? NotFound() : Content(RequestListJson, "application/json");
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

            return convertedRequest == null ? NotFound() : Content(CompressedResult, "application/json");
        }
    }
}
