using System.Net;
using System.Text.RegularExpressions;
using static System.Net.Mime.MediaTypeNames;

namespace RequestConverterAPI.Models
{
    public class FiddlerRequest : IRequest
    {
        public FiddlerRequest(string[] RequestSplit)
        {
            // Fiddler has 1 blank line on GET requests and 2 blank lines on POST
            // Make sure you remove them at the start, but leave blank lines in the
            // middle to mark the different between a header and a POST body
            var ReqSplit = RequestSplit.Take(RequestSplit.ToList().FindLastIndex(x => x != "") + 1).ToList();

            var FirstLine = ReqSplit.First().Split(' ');
            Enum.TryParse(FirstLine[0].ToUpper(), out RequestType ReqType);
            RequestType = ReqType;
            Url = FirstLine[1];

            List<string> CookieHeader = ReqSplit.Where(x => x.Contains("Cookie: ")).ToList();
            bool CookieHeaderExists = CookieHeader.Count != 0;
            if (CookieHeaderExists)
                foreach (var elems in CookieHeader.First().Replace("Cookie: ", "").Split("; "))
                    Cookies.Add(new Tuple<string, string>(elems.Split('=')[0], elems.Split('=')[1]));

            // Header shouldn't be defined by index1:count-1 because in a POST request,
            // or a request where there isn't a cookie, it will fail.
            // If cookie header exists, stop at 2, otherwise stop at 1 (at the end)
            int IndexOfPostBody = ReqSplit.FindIndex(x => string.IsNullOrEmpty(x));
            if (IndexOfPostBody == -1)
                IndexOfPostBody = CookieHeaderExists ? 2 : 1;
            else
            {
                // Add post body if request has one.
                // +1 so it doesnt touch the newline
                // -1 so it doesn't go over the range
                // TRIM LAST NEWLINE CHARACTER
                var BodyRange = ReqSplit.GetRange(IndexOfPostBody + 1, (ReqSplit.Count - IndexOfPostBody) - 1);
                foreach (var elems in BodyRange)
                {
                    if (elems.Equals(BodyRange.Last()))
                        RequestBody += elems;
                    else
                        RequestBody += elems + "\n";
                }

                IndexOfPostBody = ReqSplit.Count - (IndexOfPostBody - 1);
            }

            // Add headers
            var HeaderList = ReqSplit.GetRange(1, ReqSplit.Count - IndexOfPostBody);
            foreach (var elems in HeaderList)
                Headers.Add(new Tuple<string, string>(elems.Split(": ")[0], elems.Split(": ")[1]));
        }
    }
}
