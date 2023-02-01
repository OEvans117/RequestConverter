import { SRequest } from "../../../request/request";
import { WebsocketFormatter, FormatterExtension } from "../../code.service";

export class CSharpExtension extends FormatterExtension {

  Language = "csharp";
  
  writeimports() { return; }
  writeclass() {
    this.SetResult("public class " + this.ClassName);
    this.SetResult("{");
    this._Indent = "    ";
  }
  writehttpmethod(request: SRequest) {
    this.SetResult("public string req_" + this.GetFunctionName(request.Url) + "()")
    this.SetResult("{");
    this._Indent = "        ";
  }
  writewsmethod(request: SRequest) {
    this.SetResult("public async Task ws_" + this.GetFunctionName(request.Url) + "()")
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
