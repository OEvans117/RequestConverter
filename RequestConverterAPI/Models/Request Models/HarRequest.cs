using RequestConverterAPI.Models.HarFile;
using System.Reflection.PortableExecutable;

namespace RequestConverterAPI.Models.Request_Models
{
    public class HarRequest : SingleRequest
    {
        public HarRequest(Entry harEntry) 
        {
            Url = harEntry.Request.Url.ToString();

            // Request data
            foreach(var header in harEntry.Request.Headers)
                Headers.Add(MakeLiteral((header.Name, header.Value)));
            foreach (var cookie in harEntry.Request.Cookies)
                Cookies.Add(MakeLiteral((cookie.Name, cookie.Value)));
            if (harEntry.Request.PostData != null)
                RequestBody = harEntry.Request.PostData.Text;

            // Response data
            foreach (var header in harEntry.Response.Headers)
                ResponseData.Headers.Add(MakeLiteral((header.Name, header.Value)));
            foreach (var cookie in harEntry.Response.Cookies)
                ResponseData.Cookies.Add(MakeLiteral((cookie.Name, cookie.Value)));
            if (harEntry.Response.Content != null)
                RequestBody = harEntry.Response.Content.Text;

            Enum.TryParse(harEntry.Request.Method.ToUpper(), out RequestType ReqType);
            RequestType = ReqType;
        }
    }
}
