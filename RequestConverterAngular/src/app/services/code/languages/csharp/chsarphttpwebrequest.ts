import { Multipart, MultipartType, RequestBody, RequestBodyTypes, RequestType, SRequest } from "../../../request/request";
import { FormatterExtension, HttpFormatter } from "../../code.service";
import { CSharpWebsocketFormatter } from "./csharpwebsocket";

export class CSharpHttpWebRequestFormatter extends HttpFormatter {
  constructor() { super('HttpWebRequest', 'C#_HttpWebRequest'); }

  _Request: SRequest;
  RequestName: string = "HttpReq";
  ProxyString: string = "";

  request(request: SRequest): string {

    let extensions = this.extensions as HttpWebRequestExtension;

    extensions._Indent = "    ";
    extensions.SetResult("public string req_" + request.RequestMethodName + "()")
    extensions.SetResult("{");
    extensions._Indent = "        ";

    // Post data code
    if (request.RequestType == RequestType.POST) {
      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART) {
        extensions.SetResult("var boundary = \"------------------------\" + DateTime.Now.Ticks;");
        extensions.SetResult("var newLine = Environment.NewLine;");
        extensions.SetResult("var propFormat = \"--\" + boundary + newLine + \"Content-Disposition: form-data; name=\"{0}\" + newLine + newLine + \"{1}\" + newLine;");
        extensions.SetResult("var fileHeaderFormat = \"--\" + boundary + newLine + \"Content-Disposition: form-data; name=\"file\"; filename=\"{0}\" + newLine;\n");
      }
      else {
        extensions.SetResult("string postBody = \"" + request.RequestBody + "\";");
        request.RequestBodyInfo.Type == RequestBodyTypes.XWWWFORMURLENCODED ?
          extensions.SetResult("byte[] postBytes = Encoding.UTF8.GetBytes(HttpUtility.UrlEncode(postBody));\n") :
          extensions.SetResult("byte[] postBytes = Encoding.UTF8.GetBytes(postBody);\n");
      }
    }

    extensions.SetResult("HttpWebRequest " + this.RequestName + " = WebRequest.CreateHttp(\"" + request.Url + "\");\n")

    // Header setting code
    extensions.SetResult(this.RequestName + ".Method = \"" + RequestType[request.RequestType] + "\";")
    request.Headers.forEach((header) => {

      // Check if we've added a custom header to continue the loop
      let AddedCustom = false;

      // Set the content-type header automatically as you will add info to it.
      // future copy Fiddler/HAR request boundary so that you get the exact same format.
      // 1. study if all boundaries use that format
      // 2. build a regex that captures the last value
      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART && header.Item1.toLowerCase() == "content-type") {
        extensions.SetResult(this.RequestName + ".ContentType = \"multipart/form-data; boundary=\" + boundary;");
        return;
      }

      // Loop through default header values as they are not as simple as Add()
      ["Accept", "Connection", "Content-Type", "Except", "Host", "Referer", "Transfer-Encoding", "User-Agent"]
        .forEach((customheader => {

        // why replace - ?
        if (customheader == header.Item1) {
          extensions.SetResult(this.RequestName + "." + header.Item1.replace("-", "") + " = \"" + header.Item2 + "\";");
          AddedCustom = true;
          return;
        }
      }));

      // Add ContentLength property if header is set & request is POST.
      if (request.RequestType == RequestType.POST && header.Item1 == "Content-Length") {
        extensions.SetResult(this.RequestName + ".ContentLength = postBytes.Length;");
        AddedCustom = true;
      }

      if (AddedCustom)
        return;

      extensions.SetResult(this.RequestName + ".Headers.Add(\"" + header.Item1 + "\", \"" + header.Item2 + "\");");
    });

    // Proxy setting code
    if (this.ProxyString != "" && this.ProxyString.includes(":") && this.ProxyString.split(':').length > 0) {
      let proxyIP = this.ProxyString.split(':')[0];
      let proxyPort = this.ProxyString.split(':')[1];

      if (this.ProxyString.split(':').length == 4) {
        let proxyuser = this.ProxyString.split(':')[2];
        let proxypass = this.ProxyString.split(':')[3];
        extensions.SetResult(this.RequestName + ".Proxy = new WebProxy(\"" + proxyIP + ":" + proxyPort + "\", true)");
        extensions.SetResult("{");
        extensions.SetResult("    Credentials = new NetworkCredential(\"" + proxyuser + "\", \"" + proxypass + "\"),");
        extensions.SetResult("    UseDefaultCredentials = false");
        extensions.SetResult("};");
      }

      if (this.ProxyString.split(':').length == 2) {
        extensions.SetResult(this.RequestName + ".Proxy = new WebProxy(\"" + proxyIP + "\", " + proxyPort + ");");
      }
    }

    extensions.SetResult("");

    // Write post data to request code
    if (request.RequestType == RequestType.POST) {

      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART) {
        const multipart = request.RequestBodyInfo as Multipart;
        extensions.SetResult("using(Stream requestBody = " + this.RequestName + ".GetRequestStream())");
        extensions.SetResult("{");
        extensions.SetResult("    var reqWriter = new StreamWriter(reqStream);");
        multipart.FormData.forEach(mpfd => {
          if (mpfd.Type == MultipartType.Property) {
            extensions.SetResult("    reqWriter.Write(string.Format(propFormat, \"" + mpfd.Name + "\", \"" + mpfd.Value + "\"));");
          }
          else if (mpfd.Type == MultipartType.FileHeader) {
            extensions.SetResult("    reqWriter.Write(string.Format(fileHeaderFormat, \"" + mpfd.Filename + "\"));");
          }
        })
        extensions.SetResult("    reqWriter.Write(\"--\" + boundary + \"--\");");
        extensions.SetResult("    reqWriter.Flush();");
        extensions.SetResult("}\n");
      }
      else {
        extensions.SetResult("using(Stream requestBody = " + this.RequestName + ".GetRequestStream())");
        extensions.SetResult("    requestBody.Write(postBytes, 0, postBytes.Length);\n");
      }
    }

    // Response retrieval code
    extensions.SetResult("using(HttpWebResponse response = (HttpWebResponse)" + this.RequestName + ".GetResponse())");
    extensions.SetResult("using(Stream stream = response.GetResponseStream())");
    extensions.SetResult("using(StreamReader reader = new StreamReader(stream))");
    extensions.SetResult("{");
    extensions.SetResult("    return reader.ReadToEnd();");
    extensions.SetResult("}");

    extensions._Indent = "    ";
    extensions.SetResult("}\n");

    return extensions.GetResult(extensions._Result);
  }
}

export class HttpWebRequestExtension extends FormatterExtension {

  _Language = "C#_HttpWebRequest";

  WriteAboveRequests() {
    this.SetResult("public class " + this.ClassName);
    this.SetResult("{");
    this._Indent = "    ";
  }
  WriteBelowRequests() {
    this._Indent = "";
    this.SetResult("}");
  }
}
