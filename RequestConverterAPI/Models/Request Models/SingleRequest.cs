using System.Net;
using System.Text.Json.Serialization;

namespace RequestConverterAPI.Models
{
    public abstract class SingleRequest
    {
        public Guid RequestID { get; set; } = Guid.NewGuid();

        public string? Url { get; set; }

        public (string, string) MakeLiteral((string, string) tuple) => (tuple.Item1.Replace("\"", "\\\""), tuple.Item2.Replace("\"", "\\\""));

        public List<(string, string)> Headers = new List<(string, string)>();
        public List<(string, string)> Cookies = new List<(string, string)>();

        public string? RequestBody { get; set; }

        public RequestType RequestType { get; set; }

        [JsonIgnore]
        public SingleResponse ResponseData { get; set; }
    }

    public class SingleResponse
    {
        public string Body { get; set; }

        public List<(string, string)> Headers = new List<(string, string)>();

        public List<(string, string)> Cookies = new List<(string, string)>();
    }

    public enum RequestType
    {
        GET,
        HEAD,
        POST,
        PUT,
        DELETE,
        CONNECT,
        OPTIONS,
        TRACE,
        PATCH
    }
}
