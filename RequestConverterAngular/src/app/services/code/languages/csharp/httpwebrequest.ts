import { forEach } from "jszip";
import { Multipart, MultipartType, RequestBody, RequestBodyTypes, RequestType, SRequest } from "../../../request/request";
import { CodeFormatter } from "../../code.service";
import { CSharpWebsocketFormatter } from "./csharpwebsocket";

export class CSharpHttpWebRequestFormatter extends CodeFormatter {
  constructor() { super('httpwebrequest', 'csharp'); }

  RequestName: string = "HttpReq";
  ProxyString: string = "";
  CSharpWebsocketFormatter = new CSharpWebsocketFormatter();

  request(request: SRequest): string {

    if (this.FunctionWrap) {
      if (this.ClassWrap) {
        this.extensions._Indent = "    ";
        this.extensions.SetResult("public string req_" + this.extensions.GetFunctionName(request.Url) + "()")
        this.extensions.SetResult("{");
        this.extensions._Indent = "        ";
      }
      else {
        this.extensions.SetResult("public string req_" + this.extensions.GetFunctionName(request.Url) + "()")
        this.extensions.SetResult("{");
        this.extensions._Indent = "    ";
      }
    }

    if (request.RequestType == RequestType.POST) {

      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART) {
        this.extensions.SetResult("var boundary = \"------------------------\" + DateTime.Now.Ticks;");
        this.extensions.SetResult("var newLine = Environment.NewLine;");
        this.extensions.SetResult("var propFormat = \"--\" + boundary + newLine + \"Content-Disposition: form-data; name=\"{0}\" + newLine + newLine + \"{1}\" + newLine;");
        this.extensions.SetResult("var fileHeaderFormat = \"--\" + boundary + newLine + \"Content-Disposition: form-data; name=\"file\"; filename=\"{0}\" + newLine;\n");
      }
      else {
        this.extensions.SetResult("string postBody = \"" + request.RequestBody + "\";");

        request.RequestBodyInfo.Type == RequestBodyTypes.XWWWFORMURLENCODED ?
          this.extensions.SetResult("byte[] postBytes = Encoding.UTF8.GetBytes(HttpUtility.UrlEncode(postBody));\n") :
          this.extensions.SetResult("byte[] postBytes = Encoding.UTF8.GetBytes(postBody);\n");
      }
    }

    this.extensions.SetResult("HttpWebRequest " + this.RequestName + " = WebRequest.CreateHttp(\"" + request.Url + "\");\n")

    this.extensions.SetResult(this.RequestName + ".Method = \"" + RequestType[request.RequestType] + "\";")
    request.Headers.forEach((header) => {

      // Check if we've added a custom header to continue the loop
      let AddedCustom = false;

      // Set the content-type header automatically as you will add info to it.
      // future copy Fiddler/HAR request boundary so that you get the exact same format.
      // 1. study if all boundaries use that format
      // 2. build a regex that captures the last value
      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART && header.Item1.toLowerCase() == "content-type") {
        this.extensions.SetResult(this.RequestName + ".ContentType = \"multipart/form-data; boundary=\" + boundary;");
        return;
      }

      // Loop through default header values as they are not as simple as Add()
      ["Accept", "Connection", "Content-Type", "Except", "Host", "Referer", "Transfer-Encoding", "User-Agent"]
        .forEach((customheader => {

        // why replace - ?
        if (customheader == header.Item1) {
          this.extensions.SetResult(this.RequestName + "." + header.Item1.replace("-", "") + " = \"" + header.Item2 + "\";");
          AddedCustom = true;
          return;
        }
      }));

      // Add ContentLength property if header is set & request is POST.
      if (request.RequestType == RequestType.POST && header.Item1 == "Content-Length") {
        this.extensions.SetResult(this.RequestName + ".ContentLength = postBytes.Length;");
        AddedCustom = true;
      }

      if (AddedCustom)
        return;

      this.extensions.SetResult(this.RequestName + ".Headers.Add(\"" + header.Item1 + "\", \"" + header.Item2 + "\");");
    });

    if (this.ProxyString != "" && this.ProxyString.includes(":") && this.ProxyString.split(':').length > 0) {

      let proxyIP = this.ProxyString.split(':')[0];
      let proxyPort = this.ProxyString.split(':')[1];

      if (this.ProxyString.split(':').length == 4) {
        let proxyuser = this.ProxyString.split(':')[2];
        let proxypass = this.ProxyString.split(':')[3];
        this.extensions.SetResult(this.RequestName + ".Proxy = new WebProxy(\"" + proxyIP + ":" + proxyPort + "\", true)");
        this.extensions.SetResult("{");
        this.extensions.SetResult("    Credentials = new NetworkCredential(\"" + proxyuser + "\", \"" + proxypass + "\"),");
        this.extensions.SetResult("    UseDefaultCredentials = false");
        this.extensions.SetResult("};");
      }

      if (this.ProxyString.split(':').length == 2) {
        this.extensions.SetResult(this.RequestName + ".Proxy = new WebProxy(\"" + proxyIP + "\", " + proxyPort + ");");
      }
    }

    this.extensions.SetResult("");

    if (request.RequestType == RequestType.POST) {

      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART) {
        const multipart = request.RequestBodyInfo as Multipart;
        this.extensions.SetResult("using(Stream requestBody = " + this.RequestName + ".GetRequestStream())");
        this.extensions.SetResult("{");
        this.extensions.SetResult("    var reqWriter = new StreamWriter(reqStream);");
        multipart.FormData.forEach(mpfd => {
          if (mpfd.Type == MultipartType.Property) {
            this.extensions.SetResult("    reqWriter.Write(string.Format(propFormat, \"" + mpfd.Name + "\", \"" + mpfd.Value + "\"));");
          }
          else if (mpfd.Type == MultipartType.FileHeader) {
            this.extensions.SetResult("    reqWriter.Write(string.Format(fileHeaderFormat, \"" + mpfd.Filename + "\"));");
          }
        })
        this.extensions.SetResult("    reqWriter.Write(\"--\" + boundary + \"--\");");
        this.extensions.SetResult("    reqWriter.Flush();");
        this.extensions.SetResult("}\n");
      }
      else {
        this.extensions.SetResult("using(Stream requestBody = " + this.RequestName + ".GetRequestStream())");
        this.extensions.SetResult("    requestBody.Write(postBytes, 0, postBytes.Length);\n");
      }
    }

    this.extensions.SetResult("using(HttpWebResponse response = (HttpWebResponse)" + this.RequestName + ".GetResponse())");
    this.extensions.SetResult("using(Stream stream = response.GetResponseStream())");
    this.extensions.SetResult("using(StreamReader reader = new StreamReader(stream))");
    this.extensions.SetResult("{");
    this.extensions.SetResult("    return reader.ReadToEnd();");
    this.extensions.SetResult("}");

    if (this.FunctionWrap) {
      if (this.ClassWrap) {
        this.extensions._Indent = "    ";
      }
      else {
        this.extensions._Indent = "";
      }
      this.extensions.SetResult("}");
    }

    return this.extensions.GetResult(this.extensions._Result);
  }

  websocket(request: SRequest): string {

    let functionName = this.extensions.GetFunctionName(request.Url)

    if (this.FunctionWrap) {
      if (this.ClassWrap) {
        this.extensions._Indent = "    ";
        this.extensions.SetResult("public async Task ws_" + this.extensions.GetFunctionName(request.Url) + "()")
        this.extensions.SetResult("{");
        this.extensions._Indent = "        ";
      }
      else {
        this.extensions.SetResult("public async Task ws_" + this.extensions.GetFunctionName(request.Url) + "()")
        this.extensions.SetResult("{");
        this.extensions._Indent = "    ";
      }
    }

    this.extensions.SetResult("var ws = new ClientWebSocket();");

    request.Headers.forEach(header => {
      this.extensions.SetResult("ws.Options.SetRequestHeader(\"" + header.Item1 + "\", \"" + header.Item2 + "\");");
    })

    this.extensions.SetResult("");

    request.Cookies.forEach(cookie => {
      this.extensions.SetResult("ws.Options.Cookies.Add(new Cookie(\"" + cookie.Item1 + "\", \"" + cookie.Item2 + "\"));");
    })

    this.extensions.SetResult("");

    this.extensions.SetResult("var cts = new CancellationTokenSource();");
    this.extensions.SetResult("await ws.ConnectAsync(new Uri(\"" + request.Url + "\"), cts.Token);");

    if (this.FunctionWrap) {
      if (this.ClassWrap) {
        this.extensions._Indent = "    ";
      }
      else {
        this.extensions._Indent = "";
      }
      this.extensions.SetResult("}");
    }

    return this.extensions.GetResult(this.extensions._Result);
  }
  
  all(requests: SRequest[]): string {

    let requeststrings: string[] = [];

    if (this.ClassWrap) {
      this.extensions.SetResult("public class " + this.ClassName);
      this.extensions.SetResult("{");
      this.extensions._Indent = "    ";
    }

    requests.forEach(request => {
      if (request.RequestType == RequestType.WEBSOCKET) {
        requeststrings.push(this.websocket(request) + "\n");
      }
      else {
        requeststrings.push(this.request(request) + "\n");
      }
    })

    this.extensions.SetResult("}");

    return this.extensions.GetResult(requeststrings);
  }
}
