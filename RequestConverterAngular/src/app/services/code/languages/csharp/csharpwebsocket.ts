import { SRequest } from "../../../request/request";
import { WebsocketFormatter, FormatterExtensions, FormatterOptions } from "../../code.service";

export class CSharpWebsocketFormatter implements WebsocketFormatter {
  GetWebsocketString(request: SRequest, options:FormatterOptions): string {
    let functionName = this.FormatterExtensions.GetFunctionName(request.Url)

    if (options.FunctionWrap) {
      if (options.ClassWrap) {
        this.FormatterExtensions._Indent = "    ";
        this.FormatterExtensions.SetResult("public async Task ws_" + this.FormatterExtensions.GetFunctionName(request.Url) + "()")
        this.FormatterExtensions.SetResult("{");
        this.FormatterExtensions._Indent = "        ";
      }
      else {
        this.FormatterExtensions.SetResult("public async Task ws_" + this.FormatterExtensions.GetFunctionName(request.Url) + "()")
        this.FormatterExtensions.SetResult("{");
        this.FormatterExtensions._Indent = "    ";
      }
    }

    this.FormatterExtensions.SetResult("var ws = new ClientWebSocket();");

    request.Headers.forEach(header => {
      this.FormatterExtensions.SetResult("ws.Options.SetRequestHeader(\"" + header.Item1 + "\", \"" + header.Item2 + "\");");
    })

    this.FormatterExtensions.SetResult("");

    request.Cookies.forEach(cookie => {
      this.FormatterExtensions.SetResult("ws.Options.Cookies.Add(new Cookie(\"" + cookie.Item1 + "\", \"" + cookie.Item2 + "\"));");
    })

    this.FormatterExtensions.SetResult("");

    this.FormatterExtensions.SetResult("var cts = new CancellationTokenSource();");
    this.FormatterExtensions.SetResult("await ws.ConnectAsync(new Uri(\"" + request.Url + "\"), cts.Token);");

    if (options.FunctionWrap) {
      if (options.ClassWrap) {
        this.FormatterExtensions._Indent = "    ";
      }
      else {
        this.FormatterExtensions._Indent = "";
      }
      this.FormatterExtensions.SetResult("}");
    }

    return this.FormatterExtensions.GetResult(this.FormatterExtensions._Result);
  }
  FormatterExtensions = new FormatterExtensions();
}
