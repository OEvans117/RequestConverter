namespace RequestConverterAPI.Models
{
    public class IRequest
    {
        public Guid RequestID { get; set; } = Guid.NewGuid();

        public string? Url { get; set; }

        public List<Tuple<string, string>> Headers { get; set; } = new List<Tuple<string, string>>();

        public List<Tuple<string, string>> Cookies { get; set; } = new List<Tuple<string, string>>();

        public string? RequestBody { get; set; }

        public RequestType RequestType { get; set; }
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
