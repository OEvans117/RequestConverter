import { RequestType, SRequest } from "../../../request/request";
import { WebsocketFormatter, FormatterExtension } from "../../code.service";

export class PythonExtension extends FormatterExtension {

  _Language = "Python";

  writeaboverequests() {
    if (this._HasHttpRequest) {
      this.SetResult("import requests")
      this.SetResult("from collections import OrderedDict\n")
    }

    if (this._HasWebsocket) {
      this.SetResult("import websocket\n")
    }

    this.SetResult("class " + this.ClassName + ":");
  }
  writebelowrequests() {
    this.SetResult("");
  }
}
