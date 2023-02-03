import { Multipart, MultipartType, RequestBody, RequestBodyTypes, RequestType, SRequest } from "../../../request/request";
import { FormatterExtension, HttpFormatter } from "../../code.service";
import { CSharpWebsocketFormatter } from "./csharpwebsocket";

export class CSharpHttpClientFormatter extends HttpFormatter {
  constructor() { super('HttpClient', 'C#_HttpClient'); }

  _Request: SRequest;
  RequestName: string = "HttpReq";
  ResponseName: string = "HttpReq";
  ProxyString: string = "";

  request(request: SRequest): string {

    this.extensions._Indent = "    ";
    this.extensions.SetResult("public string req_" + request.RequestMethodName + "()")
    this.extensions.SetResult("{");
    this.extensions._Indent = "        ";

    this.extensions.SetResult("// Work in progress!")
    this.extensions.SetResult("using HttpResponseMessage " + this.RequestName + " = await client.GetAsync(\"" + request.Url + "\");")
    this.extensions.SetResult("string " + this.ResponseName + " = await response.Content.ReadAsStringAsync();")

    this.extensions._Indent = "    ";
    this.extensions.SetResult("}\n");

    return this.extensions.GetResult(this.extensions._Result);
  }
}

export class CSharpHttpClientExtension extends FormatterExtension {
  _Language = "C#_HttpClient";

  writeaboverequests() {
    this.SetResult("public class " + this.ClassName);
    this.SetResult("{");
    this._Indent = "    ";
    this.SetResult("static readonly HttpClient client = new HttpClient();")
  }
  writebelowrequests() {
    this._Indent = "";
    this.SetResult("}");
  }
}
