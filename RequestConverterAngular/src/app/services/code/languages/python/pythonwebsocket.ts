import { SRequest } from "../../../request/request";
import { WebsocketFormatter, FormatterExtensions, FormatterOptions } from "../../code.service";

export class PythonWebsocketFormatter implements WebsocketFormatter {
  GetWebsocketString(request: SRequest, options: FormatterOptions): string {
    let functionName = this.FormatterExtensions.GetFunctionName(request.Url)

    if (options.FunctionWrap) {
      if (options.ClassWrap) {
        this.FormatterExtensions._Indent = "    ";
        this.FormatterExtensions.SetResult("def ws_" + functionName + "(self):")
        this.FormatterExtensions._Indent = "        ";
      }
      else {
        this.FormatterExtensions.SetResult("def ws_" + functionName + "():")
        this.FormatterExtensions._Indent = "    ";
      }
    }

    let funcNameToLower = functionName.toLowerCase()

    // Websocket contains headers, so create dict.
    if (request.Headers.length > 1) {
      this.FormatterExtensions.SetResult(funcNameToLower + "_headers = {")
      request.Headers.forEach(header => {
        this.FormatterExtensions.SetResult("    \"" + header.Item1 + "\": \"" + header.Item2 + "\",")
      })
      this.FormatterExtensions.SetResult("}\n")
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

    this.FormatterExtensions.SetResult(websocketAppInitialization);

    if (options.ClassWrap) {
      this.FormatterExtensions.SetResult("    on_open=self." + onOpenFuncName + ",")
      this.FormatterExtensions.SetResult("    on_message=self." + onMessageFuncName + ",")
      this.FormatterExtensions.SetResult("    on_error=self." + onErrorFuncName + ",")
      this.FormatterExtensions.SetResult("    on_close=self." + onCloseFuncName + ",)")
    }
    else {
      this.FormatterExtensions.SetResult("    on_open=" + onOpenFuncName + ",")
      this.FormatterExtensions.SetResult("    on_message=" + onMessageFuncName + ",")
      this.FormatterExtensions.SetResult("    on_error=" + onErrorFuncName + ",")
      this.FormatterExtensions.SetResult("    on_close=" + onCloseFuncName + ",)")
    }
    this.FormatterExtensions.SetResult("ws.run_forever()\n")

    // If class wrap, make the indent big, otherwise small.
    options.ClassWrap ? this.FormatterExtensions._Indent = "    " : this.FormatterExtensions._Indent = ""

    // Define events
    this.FormatterExtensions.SetResult("def " + onOpenFuncName + "(ws, message):")
    this.FormatterExtensions.SetResult("    print(message)")
    this.FormatterExtensions.SetResult("def " + onMessageFuncName + "(ws, error):")
    this.FormatterExtensions.SetResult("    print(error)")
    this.FormatterExtensions.SetResult("def " + onErrorFuncName + "(ws, close_status_code, close_msg):")
    this.FormatterExtensions.SetResult("    print(\"Websocket closed\")")
    this.FormatterExtensions.SetResult("def " + onCloseFuncName + "(ws, message):")
    this.FormatterExtensions.SetResult("    print(\"Websocket opened\")")

    return this.FormatterExtensions.GetResult(this.FormatterExtensions._Result);
  }

  FormatterExtensions = new FormatterExtensions();
}
