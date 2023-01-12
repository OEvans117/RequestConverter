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

            if (TempData["bundle"] == null)
                return View(new List<IRequest>());

            using (var BundleStream = new StreamReader(Path.Combine(Path.Combine(hostingEnvironment.WebRootPath, "uploads"), (string)TempData["bundle"] + ".txt")))
                return View(JsonConvert.DeserializeObject<List<IRequest>>(BundleStream.ReadToEnd()));
        }
    }
}
