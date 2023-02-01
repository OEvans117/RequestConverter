import { SRequest } from "../../../request/request";
import { WebsocketFormatter, FormatterExtension } from "../../code.service";

export class PythonExtension extends FormatterExtension {

  Language = "python";

  writeimports() {
    if (this.HasHttpRequest) {
      this.SetResult("import requests")
      this.SetResult("from collections import OrderedDict\n")
    }

    if (this.HasWebsocket) {
      this.SetResult("import websocket\n")
    }
  }
  writeclass() {
    this.SetResult("class " + this.ClassName + ":");
    this._Indent = "    ";
  }
  writehttpmethod(request: SRequest) {
    this.SetResult("def req_" + request.RequestMethodName + "():")
    this._Indent = "        ";
  }
  writewsmethod(request: SRequest) {
    this.writehttpmethod(request);
  }
  writeclosemethod() {
    this.SetResult("");
  }
  writecloseclass() {
    return;
  }
}
