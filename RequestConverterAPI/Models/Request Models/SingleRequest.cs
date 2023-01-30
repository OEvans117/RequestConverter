using System.Net;
using System.Text.Json.Serialization;

namespace RequestConverterAPI.Models
{
    public abstract class SingleRequest
    {
        public abstract void SetRequestInfo();

        public abstract void SetResponseInfo();

        public Guid RequestID { get; set; } = Guid.NewGuid();

        public string? Url { get; set; }

        public List<(string, string)> Headers = new List<(string, string)>();
        public List<(string, string)> Cookies = new List<(string, string)>();

        public string? RequestBody { get; set; }

        public RequestType RequestType { get; set; }

        [JsonIgnore]
        public SingleResponse ResponseData { get; set; } = new SingleResponse();
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
        PATCH,
        WEBSOCKET
    }
}
