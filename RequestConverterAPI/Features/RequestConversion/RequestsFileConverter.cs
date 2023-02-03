using RequestConverterAPI.Models.HarFile;
using RequestConverterAPI.Models.Request_Models;
using RequestConverterAPI.Models;
using System.IO.Compression;
using System.Text.Json;
using System.Net.WebSockets;
using System.Text;

namespace RequestConverterAPI.Features.RequestConversion
{
    public class RequestsFileConverter
    {
        IFormFile RequestBundle { get; set; }

        List<SingleRequest> RequestList = new List<SingleRequest>();

        //I toke the liberty of renaming the variable to a camelCase style, the industry normally adopts this way
        // https://en.wikipedia.org/wiki/Camel_case
        public List<SingleRequest> ConvertRequestsToList(IFormFile requestBundle)
        {
            RequestBundle = requestBundle;

            return Path.GetExtension(requestBundle.FileName) switch
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
                //As we are doing a .ToList() here, we can simplify and use var in the declaration.
                var RequestEntry = archive.Entries.Where(x => x.Name.Contains("_c")).ToList();
                var ResponseEntry = archive.Entries.Where(x => x.Name.Contains("_s")).ToList();

                for(int i = 0; i < RequestEntry.Count; i++)
                {
                    string[] RequestSplit;
                    using (var sr = new StreamReader(RequestEntry[i].Open()))
                        RequestSplit = sr.ReadToEnd().Split("\r\n");

                    // We don't want to parse connects.
                    if (RequestSplit[0].Contains("CONNECT"))
                        continue;

                    string[] ResponseSplit;
                    using (var sr = new StreamReader(ResponseEntry[i].Open()))
                        ResponseSplit = sr.ReadToEnd().Split("\r\n");

                    var FiddlerRequest = new FiddlerRequest(RequestSplit, ResponseSplit);

                    // Set request as websocket if contains x_w.txt and upgrade websocket header
                    if(archive.Entries.Any(x => x.Name.Contains("_w")) 
                        && FiddlerRequest.Headers.Any(h => h.Item1 == "Upgrade" && h.Item2 == "websocket"))
                    {
                        FiddlerRequest.RequestType = RequestType.WEBSOCKET;
                    }

                    RequestList.Add(FiddlerRequest);
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
