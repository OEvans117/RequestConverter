import { forEach } from "jszip";
import { RequestType, SRequest } from "../../../components/welcomepage/welcomepage.component";
import { CodeFormatter } from "../code.service";

export class CSharpHttpWebRequestFormatter extends CodeFormatter {
  constructor() { super('httpwebrequest'); }

  RequestName: string = "HttpReq";
  ProxyString: string = "";

  request(request: SRequest, functionwrap: boolean): string {

    if (functionwrap) {
      this.SetResult("public string req_" + request.RequestID.split('-')[0] + "()")
      this.SetResult("{");
      this._Indent = "    ";
    }

    if (request.RequestType == RequestType.POST) {
      this.SetResult("string postBody = \"" + request.RequestBody + "\";");
      this.SetResult("byte[] postBytes = Encoding.UTF8.GetBytes(postBody);\n");
    }

    this.SetResult("HttpWebRequest " + this.RequestName + " = WebRequest.CreateHttp(\"" + request.Url + "\");\n")

    this.SetResult(this.RequestName + ".Method = \"" + RequestType[request.RequestType] + "\";")
    request.Headers.forEach((header) => {

      // Check if we've added a custom header to continue the loop
      let AddedCustom = false;

      // Loop through default header values as they are not as simple as Add()
      ["Accept", "Connection", "Content-Type", "Except", "Host", "Referer", "Transfer-Encoding", "User-Agent"]
        .forEach((customheader => {
        if (customheader.replace("-", "") == header.Item1) {
          this.SetResult(this.RequestName + "." + header.Item1 + " = \"" + header.Item2 + "\";");
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
      this.SetResult("using(Stream requestBody = " + this.RequestName + ".GetRequestStream())");
      this.SetResult("    requestBody.Write(postBytes, 0, postBytes.Length);\n");
    }

    this.SetResult("using(HttpWebResponse response = (HttpWebResponse)" + this.RequestName + ".GetResponse())");
    this.SetResult("using(Stream stream = response.GetResponseStream())");
    this.SetResult("using(StreamReader reader = new StreamReader(stream))");
    this.SetResult("{");
    this.SetResult("    return reader.ReadToEnd();");
    this.SetResult("}");

    if (functionwrap) {
      this._Indent = "";
      this.SetResult("}");
    }

    console.log(this.Result);

    return this.GetResult(this.Result);
  }

  requests(requests: SRequest[]): string {

    let requeststrings: string[] = [];

    requests.forEach(request => {
      requeststrings.push(this.request(request, true) + "\n");
    })

    return this.GetResult(requeststrings);
  }
}
