using RequestConverterAPI.Models.HarFile;
using RequestConverterAPI.Models.Request_Models;
using RequestConverterAPI.Models;
using System.IO.Compression;
using System.Text.Json;

namespace RequestConverterAPI.Features.RequestConversion
{
    public class RequestsFileConverter
    {
        IFormFile RequestBundle { get; set; }

        List<SingleRequest> RequestList = new List<SingleRequest>();

        public List<SingleRequest> ConvertRequestsToList(IFormFile RequestBundle)
        {
            this.RequestBundle = RequestBundle;

            return Path.GetExtension(RequestBundle.FileName) switch
            {
                ".saz" => ConvertFiddler(),
                ".har" => ConvertHar(),
                _ => throw new NotImplementedException(),
            };
        }

        private List<SingleRequest> ConvertFiddler()
        {
            using (var stream = RequestBundle.OpenReadStream())
            using (var archive = new ZipArchive(stream))
            {
                List<ZipArchiveEntry> RequestEntry = archive.Entries.Where(x => x.Name.Contains("_c")).ToList();
                List<ZipArchiveEntry> ResponseEntry = archive.Entries.Where(x => x.Name.Contains("_s")).ToList();

                for(int i = 0; i < RequestEntry.Count; i++)
                {
                    string[] RequestSplit;
                    using (var sr = new StreamReader(RequestEntry[i].Open()))
                        RequestSplit = sr.ReadToEnd().Split("\r\n");

                    string[] ResponseSplit;
                    using (var sr = new StreamReader(ResponseEntry[i].Open()))
                        ResponseSplit = sr.ReadToEnd().Split("\r\n");

                    if (!RequestSplit[0].Contains("CONNECT"))
                        RequestList.Add(new FiddlerRequest(RequestSplit, ResponseSplit));
                }
            }

            return RequestList;
        }

        private List<SingleRequest> ConvertHar()
        {
            using (var stream = RequestBundle.OpenReadStream())
            using (var sr = new StreamReader(stream))
            {
                var JSONData = JsonSerializer.Deserialize<HarJson>(sr.ReadToEnd());

                if (JSONData != null)
                    foreach (var entry in JSONData.Log.Entries)
                        RequestList.Add(new HarRequest(entry));
            }

            return RequestList;
        }
    }
}
