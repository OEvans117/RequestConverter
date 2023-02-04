import { Multipart, MultipartType, RequestBody, RequestBodyTypes, RequestType, SRequest } from "../../../request/request";
import { FormatterExtension, HttpFormatter } from "../../code.service";
import { CSharpWebsocketFormatter } from "./csharpwebsocket";

export class CSharpHttpClientFormatter extends HttpFormatter {
  constructor() { super('HttpClient', 'C#_HttpClient'); }

  _Request: SRequest;
  RequestName: string = "HttpReq";
  ResponseName: string = "HttpReq";

  private convertRequestType(string: string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  request(request: SRequest): string {

    this.extensions._Indent = "    ";
    this.extensions.SetResult("public async Task<string> req_" + request.RequestMethodName + "()")
    this.extensions.SetResult("{");
    this.extensions._Indent = "        ";

    // Fix this!
    if (this.extensions._DefaultUrl != "") {
      this.extensions.SetResult("using(var " + this.RequestName + " = new HttpRequestMessage(HttpMethod." + this.convertRequestType(RequestType[request.RequestType]) + ", \"/\"))")
    }
    else {
      this.extensions.SetResult("using(var " + this.RequestName + " = new HttpRequestMessage(HttpMethod." + this.convertRequestType(RequestType[request.RequestType]) + ", \"" + request.Url + "\"))")
    }
    this.extensions.SetResult("{")

    // Remove headers that I set as default from list, and then add remains
    let newHeaderList = this.extensions.SubtractArrayElements(request.Headers, this.extensions._DefaultHeaders);
    if (newHeaderList.length > 0) {
      newHeaderList.forEach(header => {
        this.extensions.SetResult("    " + this.RequestName + ".Headers.Add(\"" + header.Item1 + "\", \"" + header.Item2 + "\");")
      })
      this.extensions.SetResult("");
    }

    // Remove cookies that I set as default from list, and then add remains
    let newCookieList = this.extensions.SubtractArrayElements(request.Cookies, this.extensions._DefaultCookies);
    if (newCookieList.length > 0) {
      newCookieList.forEach(cookie => {
        this.extensions.SetResult("    cookieContainer.Add(new Cookie(\"" + cookie.Item1 + "\", \"" + cookie.Item2 + "\"));");
      })
      this.extensions.SetResult("");
    }

    this.extensions.SetResult("    var response = await client.SendAsync(" + this.RequestName + ");\n")
    this.extensions.SetResult("    return await response.Content.ReadAsStringAsync();")
    this.extensions.SetResult("}")

    this.extensions._Indent = "    ";
    this.extensions.SetResult("}\n");

    return this.extensions.GetResult(this.extensions._Result);
  }
}

export class CSharpHttpClientExtension extends FormatterExtension {
  _Language = "C#_HttpClient";

  DefaultProxyString: string = "";

  WriteAboveRequests() {
    this.SetResult("public class " + this.ClassName);
    this.SetResult("{");
    this._Indent = "    ";

    // Create clientProxy
    let ValidClientProxy = this.DefaultProxyString != "" && this.DefaultProxyString.includes(":") && this.DefaultProxyString.split(':').length > 0;
    if (this.DefaultProxyString != "" && this.DefaultProxyString.includes(":") && this.DefaultProxyString.split(':').length > 0) {
      // Normal proxy
      if (this.DefaultProxyString.split(':').length == 2)
        this.SetResult("var clientProxy = new WebProxy(\"" + this.DefaultProxyString.split(':')[0] + "\", " + this.DefaultProxyString.split(':')[1] + ");");
      // Credential authentication proxy
      if (this.DefaultProxyString.split(':').length == 4) {
        this.SetResult("var clientProxy = new WebProxy(\"" + this.DefaultProxyString.split(':')[0] + ":" + this.DefaultProxyString.split(':')[1] + "\", true)");
        this.SetResult("{");
        this.SetResult("    Credentials = new NetworkCredential(\"" + this.DefaultProxyString.split(':')[2] + "\", \"" + this.DefaultProxyString.split(':')[3] + "\"),");
        this.SetResult("    UseDefaultCredentials = false");
        this.SetResult("}");
      }
      this.SetResult("")
    }

    // Check whether there is default cookies
    let HasDefaultCookies = this._DefaultCookies.length > 0;

    // Create httpClientHandler
    let handlerName = "";
    if (ValidClientProxy || HasDefaultCookies) {
      handlerName = "handler";
      if (HasDefaultCookies) {
        this.SetResult("static CookieContainer cookieContainer = new CookieContainer();")
      }

      this.SetResult("static HttpClientHandler " + handlerName + " = new HttpClientHandler()")
      this.SetResult("{")
      if (ValidClientProxy) {
        this.SetResult("    Proxy = clientProxy,")
      }
      if (HasDefaultCookies) {
        this.SetResult("    CookieContainer = cookieContainer,")
      }
      this.SetResult("};")
    }

    // Set default url
    if (this._DefaultUrl != "") {
      this.SetResult("static readonly HttpClient client = new HttpClient(" + handlerName + ")");
      this.SetResult("{");
      this.SetResult("    BaseAddress = new Uri(\"" + this._DefaultUrl + "\"),");
      this.SetResult("};\n");
    }
    else {
      this.SetResult("static readonly HttpClient client = new HttpClient(" + handlerName + ");");
    }

    // Create constructor
    if (this._DefaultHeaders.length > 0) {
      this.SetResult("public " + this.ClassName + "()");
      this.SetResult("{");
      this._Indent = "        ";
      // Set default cookies
      this._DefaultCookies.forEach(header => {
        this.SetResult("cookieContainer.Add(new Cookie(\"" + header.Item1 + "\", \"" + header.Item2 + "\"));");
      })
      // Set default headers
      this._DefaultHeaders.forEach(header => {      
        this.SetResult("client.DefaultRequestHeaders.Add(\"" + header.Item1 + "\", \"" + header.Item2 + "\");");
      })
      this._Indent = "    ";
      this.SetResult("}\n");
    }
  }
  WriteBelowRequests() {
    this._Indent = "";
    this.SetResult("}");
  }
}
