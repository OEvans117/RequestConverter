using RequestConverterAPI.Models.HarFile;
using System.Formats.Tar;
using System.Reflection.PortableExecutable;

namespace RequestConverterAPI.Models.Request_Models
{
    public class HarRequest : SingleRequest
    {
        private Entry harEntry { get; set; }

        public HarRequest(Entry harEntry) 
        {
            this.harEntry = harEntry;

            SetRequestInfo();
            SetResponseInfo();
        }

        public override void SetRequestInfo()
        {
            Url = harEntry.Request.Url.ToString();

            // Request data
            foreach (var header in harEntry.Request.Headers)
                Headers.Add((header.Name, header.Value));
            foreach (var cookie in harEntry.Request.Cookies)
                Cookies.Add((cookie.Name, cookie.Value));
            if (harEntry.Request.PostData != null)
                RequestBody = harEntry.Request.PostData.Text;

            Enum.TryParse(harEntry.Request.Method.ToUpper(), out RequestType ReqType);
            RequestType = ReqType;
        }

        public override void SetResponseInfo()
        {
            // Response data
            foreach (var header in harEntry.Response.Headers)
                ResponseData.Headers.Add((header.Name, header.Value));
            foreach (var cookie in harEntry.Response.Cookies)
                ResponseData.Cookies.Add((cookie.Name, cookie.Value));
            if (harEntry.Response.Content != null)
                ResponseData.Body = harEntry.Response.Content.Text;
        }
    }
}
