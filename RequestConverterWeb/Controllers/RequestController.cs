using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting.Internal;
using Newtonsoft.Json;
using RequestConverterWeb.Models;
using System;

namespace RequestConverterWeb.Controllers
{
    public class RequestController : Controller
    {
        private readonly IWebHostEnvironment hostingEnvironment;
        public RequestController(IWebHostEnvironment environment)
        {
            hostingEnvironment = environment;
        }

        public IActionResult Index()
        {
            // Read from the serialized bundle of requests stored as a txt
            // In the WebRootPath/Uploads folder.

            var UploadFolder = Path.Combine(hostingEnvironment.WebRootPath, "uploads");
            string FileName = (string)TempData["bundle"] + ".txt";
            var BundleStream = new StreamReader(Path.Combine(UploadFolder, FileName));
            var RequestList = JsonConvert.DeserializeObject<List<IRequest>>(BundleStream.ReadToEnd());

            return View(RequestList);
        }
    }
}
