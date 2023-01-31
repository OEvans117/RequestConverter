import { Multipart, MultipartType, RequestBody, RequestBodyTypes, RequestType, SRequest, XWUrlFormData, XWUrlFormEncoded } from "../../../request/request";
import { CodeFormatter, CodeService } from "../../code.service";

export class PythonRequestsFormatter extends CodeFormatter {
  constructor() { super('requests'); }

  public HeaderName: string = "reqHeaders";
  public RequestName: string = "reqName";
  public ResponseName: string = "respName";
  public ProxyString: string = "";

  request(request: SRequest): string {

    if (this.FunctionWrap) {
      if (this.ClassWrap) {
        this._Indent = "    ";
        this.SetResult("def req_" + this.GetFunctionName(request.Url) + "():")
        this._Indent = "        ";
      }
      else {
        this.SetResult("def req_" + this.GetFunctionName(request.Url) + "():")
        this._Indent = "    ";
      }
    }

    this.SetResult(this.HeaderName + " = OrderedDict([");

    request.Headers.forEach((header) => {
      // In python, files = formData will already set the header automatically.
      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART && header.Item1.toLowerCase() == "content-type")
        return;

      this.SetResult("    (\"" + header.Item1 + "\", \"" + header.Item2 + "\"),");
    });

    this.SetResult("])\n");

    if (request.RequestType == RequestType.POST) {

      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART) {
        let multipart = (request.RequestBodyInfo as Multipart);

        this.SetResult("formData = (");

        multipart.FormData.forEach(mpfd => {
          if (mpfd.Type == MultipartType.Property) {
            this.SetResult("    (\"" + mpfd.Name + "\", (None, \"" + mpfd.Value + "\")),");
          }
          else if (mpfd.Type == MultipartType.FileHeader) {
            this.SetResult("    (\"file\", (" + mpfd.Name + ", open('" + mpfd.Name + "'))),");
          }
        })

        this.SetResult(")");

        this.SetResult(this.RequestName + " = requests.post('" + request.Url + "', files = formData, headers = reqHeaders)");
      }
      else if (request.RequestBodyInfo.Type == RequestBodyTypes.XWWWFORMURLENCODED) {
        let xwwwformurlencoded = (request.RequestBodyInfo as XWUrlFormEncoded);
        this.SetResult("reqBody = {")
        xwwwformurlencoded.FormData.forEach(data =>
          this.SetResult("    \"" + data.Name + ": \"" + data.Value + "\","));
        this.SetResult("}")
        this.SetResult(this.RequestName + " = requests.post('" + request.Url + "', data = reqBody, headers = reqHeaders)");
      }
      else {
        this.SetResult("reqBody = \"" + request.RequestBody + "\"");
        this.SetResult(this.RequestName + " = requests.post('" + request.Url + "', data = reqBody, headers = reqHeaders)");
      }
    }
    else {
      this.SetResult(this.RequestName + " = requests." + RequestType[request.RequestType].toLowerCase() + "('" + request.Url + "', headers = reqHeaders)");
    }

    this.SetResult(this.ResponseName + " = reqName.text");

    return this.GetResult(this._Result);
  }

  websocket(request: SRequest): string {
    let functionName = this.GetFunctionName(request.Url)

    if (this.FunctionWrap) {
      if (this.ClassWrap) {
        this._Indent = "    ";
        this.SetResult("def ws_" + functionName + "(self):")
        this._Indent = "        ";
      }
      else {
        this.SetResult("def ws_" + functionName + "():")
        this._Indent = "    ";
      }
    }

    let funcNameToLower = functionName.toLowerCase()

    // Websocket contains headers, so create dict.
    if (request.Headers.length > 1) {
      this.SetResult(funcNameToLower + "_headers = {")
      request.Headers.forEach(header => {
        this.SetResult("    \"" + header.Item1 + "\": \"" + header.Item2 + "\",")
      })
      this.SetResult("}\n")
    }

    // Initialize, subscribe to events & start
    let onOpenFuncName = "on_open_" + funcNameToLower
    let onMessageFuncName = "on_message_" + funcNameToLower
    let onErrorFuncName = "on_error_" + funcNameToLower
    let onCloseFuncName = "on_close_" + funcNameToLower

    // Modify based on headers, cookies...
    let websocketAppInitialization = "ws = websocket.WebSocketApp(\"" + request.Url + "\",";

    // Websocket contains headers, so append string.
    if (request.Headers.length > 1) {
      websocketAppInitialization += " header=" + funcNameToLower + "_headers, ";
    }

    // Websocket contains cookies, so add them (this is the format).
    if (request.Cookies.length > 1) {
      websocketAppInitialization += "cookie=\"";
      request.Cookies.forEach(c => websocketAppInitialization += c.Item1 + "=" + c.Item2 + ";");
      websocketAppInitialization += "\", ";
    }

    this.SetResult(websocketAppInitialization);

    if (this.ClassWrap) {
      this.SetResult("    on_open=self." + onOpenFuncName + ",")
      this.SetResult("    on_message=self." + onMessageFuncName + ",")
      this.SetResult("    on_error=self." + onErrorFuncName + ",")
      this.SetResult("    on_close=self." + onCloseFuncName + ",)")
    }
    else {
      this.SetResult("    on_open=" + onOpenFuncName + ",")
      this.SetResult("    on_message=" + onMessageFuncName + ",")
      this.SetResult("    on_error=" + onErrorFuncName + ",")
      this.SetResult("    on_close=" + onCloseFuncName + ",)")
    }
    this.SetResult("ws.run_forever()\n")

    // If class wrap, make the indent big, otherwise small.
    this.ClassWrap ? this._Indent = "    " : this._Indent = ""

    // Define events
    this.SetResult("def " + onOpenFuncName + "(ws, message):")
    this.SetResult("    print(message)")
    this.SetResult("def " + onMessageFuncName + "(ws, error):")
    this.SetResult("    print(error)")
    this.SetResult("def " + onErrorFuncName + "(ws, close_status_code, close_msg):")
    this.SetResult("    print(\"Websocket closed\")")
    this.SetResult("def " + onCloseFuncName + "(ws, message):")
    this.SetResult("    print(\"Websocket opened\")")

    return this.GetResult(this._Result);
  }

  all(requests: SRequest[]): string {

    let requeststrings: string[] = [];

    if (this.ClassWrap) {

      let hasWebsocket = (requests.some(r => r.RequestType == RequestType.WEBSOCKET))
      let hasHttpRequest = (requests.some(r => r.RequestType != RequestType.WEBSOCKET))

      // only add if there is a http request
      if (hasHttpRequest) {
        this.SetResult("import requests")
        this.SetResult("from collections import OrderedDict\n")
      }

      // only add if there is a websocket
      if (hasWebsocket) {
        this.SetResult("import websocket\n")
      }

      this.SetResult("class " + this.ClassName + ":");
      this._Indent = "    ";
    }

    requests.forEach(request => {
      if (request.RequestType == RequestType.WEBSOCKET) {
        requeststrings.push(this.websocket(request) + "\n");
      }
      else {
        requeststrings.push(this.request(request) + "\n");
      }
    })

    return this.GetResult(requeststrings);
  }
}
