using RequestConverterSSR.Models;
using System.Net;
using System.Reflection.PortableExecutable;
using System.Security.Principal;
using System.Text;

namespace RequestConverterSSR.Conversion
{
    public class PythonConverter : IConverter
    {
        public string Convert(IRequest request)
        {
            StringBuilder sr = new StringBuilder();

            // Future implementation (if its only 1 header, dont order it as a dict)
            // PythonRequestOptions (saved in database)
            sr.Append("reqHeaders = OrderedDict([");
            sr.AppendLine();

            foreach(var header in request.Headers)
                sr.AppendLine("        (\"" + header.Item1 + "\", \"" + header.Item2 + "\"),");

            sr.Append("        ])");
            sr.AppendLine();

            // Future implementation (PythonRequestOptions ->
            // set the GET options (verify=false, proxies = what etc)
            switch (request.RequestType)
            {
                case RequestType.GET:

                    sr.Append("    getProfileReq = RequestSession.get('" + request.Url + "', proxies =" +
                        " Account.ProxyDict, cookies = Account.CookieDict, headers = reqHeaders, verify = False)");
                    sr.AppendLine();
                    sr.Append("    getProfileResponse = getProfileReq.text");

                    break;

                case RequestType.POST:

                    sr.AppendLine("    reqBody = \"" + request.RequestBody + "\"");
                    sr.Append("    getProfileReq = RequestSession.post('" + request.Url + "', data = reqBody, proxies =" +
                        " Account.ProxyDict, cookies = Account.CookieDict, headers = reqHeaders, verify = False)");
                    sr.AppendLine();
                    sr.Append("    getProfileResponse = getProfileReq.text");

                    break;
            }

            return sr.ToString();
        }
    }
}
