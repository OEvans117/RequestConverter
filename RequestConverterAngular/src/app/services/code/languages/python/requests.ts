import { Multipart, MultipartType, RequestBody, RequestBodyTypes, RequestType, SRequest, XWUrlFormData, XWUrlFormEncoded } from "../../../request/request";
import { CodeFormatter, CodeService } from "../../code.service";

export class PythonRequestsFormatter extends CodeFormatter {
  constructor() { super('requests', 'python'); }

  public HeaderName: string = "reqHeaders";
  public RequestName: string = "reqName";
  public ResponseName: string = "respName";

  request(request: SRequest): string {

    if (this.FunctionWrap) {
      if (this.ClassWrap) {
        this.extensions._Indent = "    ";
        this.extensions.SetResult("def req_" + this.extensions.GetFunctionName(request.Url) + "():")
        this.extensions._Indent = "        ";
      }
      else {
        this.extensions.SetResult("def req_" + this.extensions.GetFunctionName(request.Url) + "():")
        this.extensions._Indent = "    ";
      }
    }

    this.extensions.SetResult(this.HeaderName + " = OrderedDict([");

    request.Headers.forEach((header) => {
      // In python, files = formData will already set the header automatically.
      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART && header.Item1.toLowerCase() == "content-type")
        return;

      this.extensions.SetResult("    (\"" + header.Item1 + "\", \"" + header.Item2 + "\"),");
    });

    this.extensions.SetResult("])\n");

    if (request.RequestType == RequestType.POST) {

      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART) {
        let multipart = (request.RequestBodyInfo as Multipart);

        this.extensions.SetResult("formData = (");

        multipart.FormData.forEach(mpfd => {
          if (mpfd.Type == MultipartType.Property) {
            this.extensions.SetResult("    (\"" + mpfd.Name + "\", (None, \"" + mpfd.Value + "\")),");
          }
          else if (mpfd.Type == MultipartType.FileHeader) {
            this.extensions.SetResult("    (\"file\", (" + mpfd.Name + ", open('" + mpfd.Name + "'))),");
          }
        })

        this.extensions.SetResult(")");

        this.extensions.SetResult(this.RequestName + " = requests.post('" + request.Url + "', files = formData, headers = reqHeaders)");
      }
      else if (request.RequestBodyInfo.Type == RequestBodyTypes.XWWWFORMURLENCODED) {
        let xwwwformurlencoded = (request.RequestBodyInfo as XWUrlFormEncoded);
        this.extensions.SetResult("reqBody = {")
        xwwwformurlencoded.FormData.forEach(data =>
          this.extensions.SetResult("    \"" + data.Name + ": \"" + data.Value + "\","));
        this.extensions.SetResult("}")
        this.extensions.SetResult(this.RequestName + " = requests.post('" + request.Url + "', data = reqBody, headers = reqHeaders)");
      }
      else {
        this.extensions.SetResult("reqBody = \"" + request.RequestBody + "\"");
        this.extensions.SetResult(this.RequestName + " = requests.post('" + request.Url + "', data = reqBody, headers = reqHeaders)");
      }
    }
    else {
      this.extensions.SetResult(this.RequestName + " = requests." + RequestType[request.RequestType].toLowerCase() + "('" + request.Url + "', headers = reqHeaders)");
    }

    this.extensions.SetResult(this.ResponseName + " = reqName.text");

    return this.extensions.GetResult(this.extensions._Result);
  }

  websocket(request: SRequest): string {
    let functionName = this.extensions.GetFunctionName(request.Url)

    if (this.FunctionWrap) {
      if (this.ClassWrap) {
        this.extensions._Indent = "    ";
        this.extensions.SetResult("def ws_" + functionName + "(self):")
        this.extensions._Indent = "        ";
      }
      else {
        this.extensions.SetResult("def ws_" + functionName + "():")
        this.extensions._Indent = "    ";
      }
    }

    let funcNameToLower = functionName.toLowerCase()

    // Websocket contains headers, so create dict.
    if (request.Headers.length > 1) {
      this.extensions.SetResult(funcNameToLower + "_headers = {")
      request.Headers.forEach(header => {
        this.extensions.SetResult("    \"" + header.Item1 + "\": \"" + header.Item2 + "\",")
      })
      this.extensions.SetResult("}\n")
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

    this.extensions.SetResult(websocketAppInitialization);

    if (this.ClassWrap) {
      this.extensions.SetResult("    on_open=self." + onOpenFuncName + ",")
      this.extensions.SetResult("    on_message=self." + onMessageFuncName + ",")
      this.extensions.SetResult("    on_error=self." + onErrorFuncName + ",")
      this.extensions.SetResult("    on_close=self." + onCloseFuncName + ",)")
    }
    else {
      this.extensions.SetResult("    on_open=" + onOpenFuncName + ",")
      this.extensions.SetResult("    on_message=" + onMessageFuncName + ",")
      this.extensions.SetResult("    on_error=" + onErrorFuncName + ",")
      this.extensions.SetResult("    on_close=" + onCloseFuncName + ",)")
    }
    this.extensions.SetResult("ws.run_forever()\n")

    // If class wrap, make the indent big, otherwise small.
    this.ClassWrap ? this.extensions._Indent = "    " : this.extensions._Indent = ""

    // Define events
    this.extensions.SetResult("def " + onOpenFuncName + "(ws, message):")
    this.extensions.SetResult("    print(message)")
    this.extensions.SetResult("def " + onMessageFuncName + "(ws, error):")
    this.extensions.SetResult("    print(error)")
    this.extensions.SetResult("def " + onErrorFuncName + "(ws, close_status_code, close_msg):")
    this.extensions.SetResult("    print(\"Websocket closed\")")
    this.extensions.SetResult("def " + onCloseFuncName + "(ws, message):")
    this.extensions.SetResult("    print(\"Websocket opened\")")

    return this.extensions.GetResult(this.extensions._Result);
  }

  all(requests: SRequest[]): string {

    let requeststrings: string[] = [];

    if (this.ClassWrap) {

      let hasWebsocket = (requests.some(r => r.RequestType == RequestType.WEBSOCKET))
      let hasHttpRequest = (requests.some(r => r.RequestType != RequestType.WEBSOCKET))

      // only add if there is a http request
      if (hasHttpRequest) {
        this.extensions.SetResult("import requests")
        this.extensions.SetResult("from collections import OrderedDict\n")
      }

      // only add if there is a websocket
      if (hasWebsocket) {
        this.extensions.SetResult("import websocket\n")
      }

      this.extensions.SetResult("class " + this.ClassName + ":");
      this.extensions._Indent = "    ";
    }

    requests.forEach(request => {
      if (request.RequestType == RequestType.WEBSOCKET) {
        requeststrings.push(this.websocket(request) + "\n");
      }
      else {
        requeststrings.push(this.request(request) + "\n");
      }
    })

    return this.extensions.GetResult(requeststrings);
  }
}
