import { SRequest } from "../../../request/request";
import { WebsocketFormatter, FormatterExtension } from "../../code.service";

export class PythonWebsocketFormatter extends WebsocketFormatter {
  constructor() { super('Python'); }

  websocket(request: SRequest): string {
    let funcNameToLower = request.RequestMethodName.toLowerCase()

    this.extensions.SetResult("    def " + request.RequestMethodName + "():")
    this.extensions._Indent = "        ";

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

    if (this.extensions._ClassWrap) {
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
}
