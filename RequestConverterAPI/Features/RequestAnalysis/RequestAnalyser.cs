using Microsoft.OpenApi.Extensions;
using RequestConverterAPI.Models;
using RequestConverterAPI.Models.HarFile;
using System.Diagnostics;
using System.Text.RegularExpressions;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace RequestConverterAPI.Features.RequestAnalysis
{
    public class RequestAnalyser
    {
        private string JsonString { get; set; }
        List<SingleRequest> RequestList { get; set; }
        private int RequestIndex { get; set; }

        public void AnalyseRequestBundle(List<SingleRequest> RequestList, string JsonString)
        {
            this.RequestList = RequestList;
            this.JsonString = JsonString;

            // Loop backwards as the last request will most likely contains
            // acquired IDs from the requests that came before it.
            for (RequestIndex = RequestList.Count(); RequestIndex --> 0;)
            {
                var requestAnalysis = AnalyseRequest(RequestList[RequestIndex]);

                if(requestAnalysis is FoundMatch)
                {
                    Debug.WriteLine(requestAnalysis.MatchText);
                }
            }
        }

        /// Analyse whether a header, cookie, url parameter, or post body
        /// has been acquired from a previous requests' response header, cookie, body
        public IFound AnalyseRequest(SingleRequest currentRequest)
        {
            IFound analyseCookies = AnalyseRequestBasedOnTuple(currentRequest.Cookies);
            if(analyseCookies is FoundMatch)
                return analyseCookies;

            // then headers

            IFound analyseHeaders = AnalyseRequestBasedOnTuple(currentRequest.Headers);
            if (analyseHeaders is FoundMatch)
                return analyseHeaders;

            return new NotFound();
        }

        private IFound AnalyseRequestBasedOnTuple(List<(string,string)> Tuple)
        {
            foreach (var currentRequestHeader in Tuple)
            {
                // Probably not an ID if shorter than 6 characters
                if (currentRequestHeader.Item2.Length < 6)
                    continue;

                if (JsonString.Contains(currentRequestHeader.Item2))
                {
                    // Found match, now iterate through previous requests to find where it came from.

                    int AnalysisIndex;

                    for (AnalysisIndex = RequestIndex - 1; RequestIndex-- > 0;)
                    {
                        // Loop through request body first
                        // this might be null if so make changes!

                        var responseBodyMatch = Regex.Match(RequestList[AnalysisIndex].ResponseData.Body, @".{20}(" + currentRequestHeader.Item2 + ").{20}");
                        if (responseBodyMatch.Success)
                        {
                            string RespBody = $"Found {currentRequestHeader.Item2} in response body. Location: {responseBodyMatch.Value}";
                            return new FoundMatch(currentRequestHeader.Item2, Type.ResponseBody, RequestList[AnalysisIndex], RespBody);
                        }

                        // then cookies

                        foreach (var previousRequestCookies in RequestList[AnalysisIndex].ResponseData.Cookies)
                        {
                            if (previousRequestCookies.Item2.Contains(currentRequestHeader.Item2))
                                return new FoundMatch(currentRequestHeader.Item2, Type.ResponseCookie, RequestList[AnalysisIndex]);
                        }

                        // then headers

                        foreach (var previousRequestHeader in RequestList[AnalysisIndex].ResponseData.Headers)
                        {
                            if (previousRequestHeader.Item2.Contains(currentRequestHeader.Item2))
                                return new FoundMatch(currentRequestHeader.Item2, Type.ResponseHeader, RequestList[AnalysisIndex]);
                        }
                    }
                }
            }

            return new NotFound();
        }
    }

    public interface IFound
    {
        string MatchText { get; set; }
    }

    public class NotFound : IFound
    {
        public string MatchText { get; set; }

        public NotFound() { MatchText = "Not found match"; }
    }

    public class FoundMatch: IFound
    {
        public FoundMatch(string Match, Type matchType, SingleRequest requestFoundIn, string MatchText = "")
        {
            MatchType = matchType;
            RequestFoundIn = requestFoundIn;

            if(matchType == Type.ResponseBody)
                this.MatchText = MatchText;
            else
                this.MatchText = $"Found \"{Match}\" match in { MatchType.GetDisplayName() } in the {RequestFoundIn.Url} request.";
        }

        Type MatchType { get; set; }

        public SingleRequest RequestFoundIn { get; set; }

        public string MatchText { get; set; }
    }

    public enum Type
    {
        Elsewhere,
        ResponseHeader,
        ResponseCookie,
        ResponseBody
    }
}
