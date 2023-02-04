namespace RequestConverterAPI.Models.HarFile
{
    using System;
    using System.Collections.Generic;

    using System.Text.Json;
    using System.Text.Json.Serialization;
    using System.Globalization;

    public partial class HarJson
    {
        [JsonPropertyName("log")]
        public Log Log { get; set; }
    }

    public partial class Log
    {
        [JsonPropertyName("version")]
        public string Version { get; set; }

        [JsonPropertyName("creator")]
        public Creator Creator { get; set; }

        [JsonPropertyName("pages")]
        public object[] Pages { get; set; }

        [JsonPropertyName("entries")]
        public Entry[] Entries { get; set; }
    }

    public partial class Creator
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("version")]
        public string Version { get; set; }
    }

    public partial class Entry
    {
        [JsonPropertyName("_initiator")]
        public Initiator Initiator { get; set; }

        [JsonPropertyName("_priority")]
        public string Priority { get; set; }

        [JsonPropertyName("_resourceType")]
        public string ResourceType { get; set; }

        [JsonPropertyName("cache")]
        public Cache Cache { get; set; }

        [JsonPropertyName("request")]
        public Request Request { get; set; }

        [JsonPropertyName("response")]
        public Response Response { get; set; }

        [JsonPropertyName("serverIPAddress")]
        public string ServerIpAddress { get; set; }

        [JsonPropertyName("startedDateTime")]
        public string StartedDateTime { get; set; }

        [JsonPropertyName("time")]
        public double Time { get; set; }

        [JsonPropertyName("timings")]
        public Timings Timings { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [JsonPropertyName("connection")]
        public string Connection { get; set; }
    }

    public partial class Cache
    {
    }

    public partial class Initiator
    {
        [JsonPropertyName("type")]
        public string Type { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [JsonPropertyName("stack")]
        public Stack Stack { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [JsonPropertyName("url")]
        public Uri Url { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [JsonPropertyName("requestId")]
        public string RequestId { get; set; }
    }

    public partial class Stack
    {
        [JsonPropertyName("callFrames")]
        public CallFrame[] CallFrames { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [JsonPropertyName("parent")]
        public StackParent Parent { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [JsonPropertyName("parentId")]
        public ParentId ParentId { get; set; }
    }

    public partial class CallFrame
    {
        [JsonPropertyName("functionName")]
        public string FunctionName { get; set; }

        [JsonPropertyName("scriptId")]
        public string ScriptId { get; set; }

        [JsonPropertyName("url")]
        public Uri Url { get; set; }

        [JsonPropertyName("lineNumber")]
        public long LineNumber { get; set; }

        [JsonPropertyName("columnNumber")]
        public long ColumnNumber { get; set; }
    }

    public partial class StackParent
    {
        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("callFrames")]
        public CallFrame[] CallFrames { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [JsonPropertyName("parent")]
        public ParentParent Parent { get; set; }
    }

    public partial class ParentParent
    {
        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("callFrames")]
        public CallFrame[] CallFrames { get; set; }
    }

    public partial class ParentId
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("debuggerId")]
        public string DebuggerId { get; set; }
    }

    public partial class Request
    {
        [JsonPropertyName("method")]
        public string Method { get; set; }

        [JsonPropertyName("url")]
        public Uri Url { get; set; }

        [JsonPropertyName("httpVersion")]
        public string HttpVersion { get; set; }

        [JsonPropertyName("headers")]
        public Header[] Headers { get; set; }

        [JsonPropertyName("queryString")]
        public Header[] QueryString { get; set; }

        [JsonPropertyName("cookies")]
        public Cooky[] Cookies { get; set; }

        [JsonPropertyName("headersSize")]
        public long HeadersSize { get; set; }

        [JsonPropertyName("bodySize")]
        public long BodySize { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [JsonPropertyName("postData")]
        public PostData PostData { get; set; }
    }

    public partial class Cooky
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("value")]
        public string Value { get; set; }

        [JsonPropertyName("path")]
        public string Path { get; set; }

        [JsonPropertyName("domain")]
        public string Domain { get; set; }

        [JsonPropertyName("expires")]
        public string Expires { get; set; }

        [JsonPropertyName("httpOnly")]
        public bool HttpOnly { get; set; }

        [JsonPropertyName("secure")]
        public bool Secure { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [JsonPropertyName("sameSite")]
        public string SameSite { get; set; }
    }

    public partial class Header
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("value")]
        public string Value { get; set; }
    }

    public partial class PostData
    {
        [JsonPropertyName("mimeType")]
        public string MimeType { get; set; }

        [JsonPropertyName("text")]
        public string Text { get; set; }

        [JsonPropertyName("params")]
        public Header[] Params { get; set; }
    }

    public partial class Response
    {
        [JsonPropertyName("status")]
        public long Status { get; set; }

        [JsonPropertyName("statusText")]
        public string StatusText { get; set; }

        [JsonPropertyName("httpVersion")]
        public string HttpVersion { get; set; }

        [JsonPropertyName("headers")]
        public Header[] Headers { get; set; }

        [JsonPropertyName("cookies")]
        public Cooky[] Cookies { get; set; }

        [JsonPropertyName("content")]
        public Content Content { get; set; }

        [JsonPropertyName("redirectURL")]
        public string RedirectUrl { get; set; }

        [JsonPropertyName("headersSize")]
        public long HeadersSize { get; set; }

        [JsonPropertyName("bodySize")]
        public long BodySize { get; set; }

        [JsonPropertyName("_transferSize")]
        public long TransferSize { get; set; }

        [JsonPropertyName("_error")]
        public object Error { get; set; }
    }

    public partial class Content
    {
        [JsonPropertyName("size")]
        public long Size { get; set; }

        [JsonPropertyName("mimeType")]
        public string MimeType { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [JsonPropertyName("text")]
        public string Text { get; set; }
    }

    public partial class Timings
    {
        public string Blocked { get; set; }

        public string Dns { get; set; }

        public string Ssl { get; set; }

        public string Connect { get; set; }

        public string Send { get; set; }

        public string Wait { get; set; }

        public string Receive { get; set; }

        public string BlockedQueueing { get; set; }
    }
}