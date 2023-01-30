import { forEach } from "jszip";
import { Multipart, MultipartType, RequestBody, RequestBodyTypes, RequestType, SRequest } from "../../../request/request";
import { CodeFormatter } from "../../code.service";

export class CSharpHttpWebRequestFormatter extends CodeFormatter {
  constructor() { super('httpwebrequest'); }

  RequestName: string = "HttpReq";
  ProxyString: string = "";

  request(request: SRequest): string {

    if (this.FunctionWrap) {

      if (this.ClassWrap) {
        this._Indent = "    ";
        this.SetResult("public string req_" + this.GetFunctionName(request.Url) + "()")
        this.SetResult("{");
        this._Indent = "        ";
      }
      else {
        this.SetResult("public string req_" + this.GetFunctionName(request.Url) + "()")
        this.SetResult("{");
        this._Indent = "    ";
      }
    }

    if (request.RequestType == RequestType.POST) {

      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART) {
        this.SetResult("var boundary = \"------------------------\" + DateTime.Now.Ticks;");
        this.SetResult("var newLine = Environment.NewLine;");
        this.SetResult("var propFormat = \"--\" + boundary + newLine + \"Content-Disposition: form-data; name=\"{0}\" + newLine + newLine + \"{1}\" + newLine;");
        this.SetResult("var fileHeaderFormat = \"--\" + boundary + newLine + \"Content-Disposition: form-data; name=\"file\"; filename=\"{0}\" + newLine;\n");
      }
      else {
        this.SetResult("string postBody = \"" + request.RequestBody + "\";");

        request.RequestBodyInfo.Type == RequestBodyTypes.XWWWFORMURLENCODED ?
          this.SetResult("byte[] postBytes = Encoding.UTF8.GetBytes(HttpUtility.UrlEncode(postBody));\n") :
          this.SetResult("byte[] postBytes = Encoding.UTF8.GetBytes(postBody);\n");
      }
    }

    this.SetResult("HttpWebRequest " + this.RequestName + " = WebRequest.CreateHttp(\"" + request.Url + "\");\n")

    this.SetResult(this.RequestName + ".Method = \"" + RequestType[request.RequestType] + "\";")
    request.Headers.forEach((header) => {

      // Check if we've added a custom header to continue the loop
      let AddedCustom = false;

      // Set the content-type header automatically as you will add info to it.
      // future copy Fiddler/HAR request boundary so that you get the exact same format.
      // 1. study if all boundaries use that format
      // 2. build a regex that captures the last value
      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART && header.Item1.toLowerCase() == "content-type") {
        this.SetResult(this.RequestName + ".ContentType = \"multipart/form-data; boundary=\" + boundary;");
        return;
      }

      // Loop through default header values as they are not as simple as Add()
      ["Accept", "Connection", "Content-Type", "Except", "Host", "Referer", "Transfer-Encoding", "User-Agent"]
        .forEach((customheader => {

        // why replace - ?
        if (customheader == header.Item1) {
          this.SetResult(this.RequestName + "." + header.Item1.replace("-", "") + " = \"" + header.Item2 + "\";");
          AddedCustom = true;
          return;
        }
      }));

      // Add ContentLength property if header is set & request is POST.
      if (request.RequestType == RequestType.POST && header.Item1 == "Content-Length") {
        this.SetResult(this.RequestName + ".ContentLength = postBytes.Length;");
        AddedCustom = true;
      }

      if (AddedCustom)
        return;

      this.SetResult(this.RequestName + ".Headers.Add(\"" + header.Item1 + "\", \"" + header.Item2 + "\");");
    });

    if (this.ProxyString != "" && this.ProxyString.includes(":") && this.ProxyString.split(':').length > 0) {

      let proxyIP = this.ProxyString.split(':')[0];
      let proxyPort = this.ProxyString.split(':')[1];

      if (this.ProxyString.split(':').length == 4) {
        let proxyuser = this.ProxyString.split(':')[2];
        let proxypass = this.ProxyString.split(':')[3];
        this.SetResult(this.RequestName + ".Proxy = new WebProxy(\"" + proxyIP + ":" + proxyPort + "\", true)");
        this.SetResult("{");
        this.SetResult("    Credentials = new NetworkCredential(\"" + proxyuser + "\", \"" + proxypass + "\"),");
        this.SetResult("    UseDefaultCredentials = false");
        this.SetResult("};");
      }

      if (this.ProxyString.split(':').length == 2) {
        this.SetResult(this.RequestName + ".Proxy = new WebProxy(\"" + proxyIP + "\", " + proxyPort + ");");
      }
    }

    this.SetResult("");

    if (request.RequestType == RequestType.POST) {

      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART) {
        const multipart = request.RequestBodyInfo as Multipart;
        this.SetResult("using(Stream requestBody = " + this.RequestName + ".GetRequestStream())");
        this.SetResult("{");
        this.SetResult("    var reqWriter = new StreamWriter(reqStream);");
        multipart.FormData.forEach(mpfd => {
          if (mpfd.Type == MultipartType.Property) {
            this.SetResult("    reqWriter.Write(string.Format(propFormat, \"" + mpfd.Name + "\", \"" + mpfd.Value + "\"));");
          }
          else if (mpfd.Type == MultipartType.FileHeader) {
            this.SetResult("    reqWriter.Write(string.Format(fileHeaderFormat, \"" + mpfd.Filename + "\"));");
          }
        })
        this.SetResult("    reqWriter.Write(\"--\" + boundary + \"--\");");
        this.SetResult("    reqWriter.Flush();");
        this.SetResult("}\n");
      }
      else {
        this.SetResult("using(Stream requestBody = " + this.RequestName + ".GetRequestStream())");
        this.SetResult("    requestBody.Write(postBytes, 0, postBytes.Length);\n");
      }
    }

    this.SetResult("using(HttpWebResponse response = (HttpWebResponse)" + this.RequestName + ".GetResponse())");
    this.SetResult("using(Stream stream = response.GetResponseStream())");
    this.SetResult("using(StreamReader reader = new StreamReader(stream))");
    this.SetResult("{");
    this.SetResult("    return reader.ReadToEnd();");
    this.SetResult("}");

    if (this.FunctionWrap) {
      if (this.ClassWrap) {
        this._Indent = "    ";
      }
      else {
        this._Indent = "";
      }
      this.SetResult("}");
    }

    console.log(this._Result);

    return this.GetResult(this._Result);
  }

  requests(requests: SRequest[]): string {

    let requeststrings: string[] = [];

    if (this.ClassWrap) {
      this.SetResult("public class " + this.ClassName);
      this.SetResult("{");
      this._Indent = "    ";
    }

    requests.forEach(request => {
      requeststrings.push(this.request(request) + "\n");
    })

    this.SetResult("}");

    return this.GetResult(requeststrings);
  }
}
