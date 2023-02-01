import { forEach } from "jszip";
import { Multipart, MultipartType, RequestBody, RequestBodyTypes, RequestType, SRequest } from "../../../request/request";
import { FormatterExtension, HttpFormatter } from "../../code.service";
import { CSharpWebsocketFormatter } from "./csharpwebsocket";

export class CSharpHttpClientFormatter extends HttpFormatter {
  constructor() { super('httpclient', 'csharphttpclient'); }

  _Request: SRequest;
  RequestName: string = "HttpReq";
  ResponseName: string = "HttpReq";
  ProxyString: string = "";

  request(request: SRequest): string {

    this.extensions.SetResult("using HttpResponseMessage " + this.RequestName + " = await client.GetAsync(\"" + request.Url + "\");")
    this.extensions.SetResult("string " + this.ResponseName + " = await response.Content.ReadAsStringAsync();")

    return this.extensions.GetResult(this.extensions._Result);
  }
}

export class CSharpHttpClientExtension extends FormatterExtension {
  Language = "csharphttpclient";

  writeimports() { return; }
  writeclass() {
    this.SetResult("public class " + this.ClassName);
    this.SetResult("{");
    this._Indent = "    ";
    this.SetResult("static readonly HttpClient client = new HttpClient();")
  }
  writehttpmethod(request: SRequest) {
    this.SetResult("public async Task " + request.RequestMethodName + "()")
    this.SetResult("{");
    this._Indent = "        ";
  }
  writewsmethod(request: SRequest) {
    this.SetResult("public async Task ws_" + request.RequestMethodName + "()")
    this.SetResult("{");
    this._Indent = "        ";
  }
  writeclosemethod() {
    this._Indent = "    ";
    this.SetResult("}\n");
  }
  writecloseclass() {
    this._Indent = "";
    this.SetResult("}");
  }
}
