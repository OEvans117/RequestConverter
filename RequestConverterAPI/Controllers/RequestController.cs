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
using System.ComponentModel.DataAnnotations;
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
            //We should not trust the user input. If the user didn't send a file?
            //We should check if and return if there is no file, like:
            var firstFile = Request.Form.Files.FirstOrDefault();
            if (firstFile == null)
            {
                return BadRequest();
            }
            
            var RequestList = _rfc.ConvertRequestsToList(firstFile);

            //The second parameter of the serialization should be a private static constant, this will save some memory. 
            var RequestListJson = JsonSerializer.Serialize(RequestList, _jsonSerializerOptions);

            // analyse request

            // _ra.AnalyseRequestBundle(RequestList, RequestListJson);

            return RequestList.Count == 0 ? NotFound() : Content(RequestListJson, "application/json");
        }

        [HttpPost("Save")]
        public async Task<IActionResult> Save()
        {
            //no need to put string on the left side, if you are going to set immediately to string.Empty, this will save you some keystrokes.
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
        //It's good to put the framework to work for you, in this case the Required will automatically validate the value sent by the user,
        // and the `AllowEmptyStrings` will block the user to send an empty value, this will allow you to not have to create and if against that condition.
        public async Task<IActionResult> GetAsync([Required(AllowEmptyStrings = false)] string id)
        {
            //Imagine here that the ID doesn't have a convertRequest? What we should do? 
            var convertedRequest = _context.Find<ConvertedRequest>(id);
            
            var CompressedResult = await Compression.FromBrotliAsync(value: convertedRequest.ConversionResult);

            //This check is valid it's a bit late, we should do it before line 96, like this:
            // if (convertedRequest == null)
            // {
            //     return NotFound();
            // }
            
            //and in this line we just return the value from CompressedResult.
            return convertedRequest == null ? NotFound() : Ok(CompressedResult);
        }
    }
}
