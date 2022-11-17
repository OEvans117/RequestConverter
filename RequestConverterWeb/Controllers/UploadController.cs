using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RequestConverterWeb.Models;
using System.IO.Compression;

namespace RequestConverterWeb.Controllers
{
    public class UploadController : Controller
    {
        private readonly IWebHostEnvironment hostingEnvironment;
        public UploadController(IWebHostEnvironment environment)
        {
            hostingEnvironment = environment;
        }
        public IActionResult Index()
        {
            return View(new UploadViewModel());
        }

        [HttpPost]
        public IActionResult Create(UploadViewModel model)
        {
            // Update this whole module to prevent storing files & just have them in memory stream
            // for a while. Then transfer the memory stream to the next page, and allow the user to
            // save the request contents to a database which gives him an ID

            string filePath = "";
            if (model.RequestBundle != null)
            {
                var uniqueFileName = GetUniqueFileName(model.RequestBundle.FileName).Replace("saz", "zip");
                var uploads = Path.Combine(hostingEnvironment.WebRootPath, "uploads");
                filePath = Path.Combine(uploads, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                    model.RequestBundle.CopyTo(stream);
            }

            List<IRequest> RequestList = new List<IRequest>();
            using (ZipArchive archive = ZipFile.OpenRead(filePath))
            {
                foreach (ZipArchiveEntry entry in archive.Entries.Where(x => x.Name.Contains("_c")))
                {
                    string[] RequestSplit;

                    using (var sr = new StreamReader(entry.Open()))
                    {
                        string RequestText = sr.ReadToEnd().Replace("\"", @"\""");

                        RequestSplit = RequestText.Split("\r\n");
                    }

                    if (!RequestSplit[0].Contains("CONNECT"))
                        RequestList.Add(new FiddlerRequest(RequestSplit));
                }
            }

            // https://learn.microsoft.com/en-us/aspnet/core/fundamentals/app-state?view=aspnetcore-7.0#cookies
            // TempData can only store 4096 bytes, so I can't sent the serialized object.
            // Just store the file as a txt, and read it on the next page.

            string SerializedListPath = filePath.Replace("zip", "txt");
            using (StreamWriter _testData = new StreamWriter(filePath.Replace("zip", "txt"), true))
                _testData.Write(JsonConvert.SerializeObject(RequestList));
            TempData["bundle"] = Path.GetFileNameWithoutExtension(SerializedListPath);

            return RedirectToAction("Index", "Request");
        }

        private string GetUniqueFileName(string fileName)
        {
            fileName = Path.GetFileName(fileName);
            return Path.GetFileNameWithoutExtension(fileName)
                      + "_"
                      + Guid.NewGuid().ToString().Substring(0, 4)
                      + Path.GetExtension(fileName);
        }
    }
}
