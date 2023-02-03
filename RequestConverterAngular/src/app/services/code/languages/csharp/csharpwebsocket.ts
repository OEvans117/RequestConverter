import { SRequest } from "../../../request/request";
import { WebsocketFormatter, FormatterExtension } from "../../code.service";

export class CSharpWebsocketFormatter extends WebsocketFormatter {

  constructor() { super('C#'); }

  websocket(request: SRequest): string {

    this.extensions.SetResult("    public async Task ws_" + request.RequestMethodName + "()")
    this.extensions.SetResult("    {");
    this.extensions._Indent = "        ";

    this.extensions.SetResult("var ws = new ClientWebSocket();");

    request.Headers.forEach(header => {
      this.extensions.SetResult("ws.Options.SetRequestHeader(\"" + header.Item1 + "\", \"" + header.Item2 + "\");");
    })

    this.extensions.SetResult("");

    request.Cookies.forEach(cookie => {
      this.extensions.SetResult("ws.Options.Cookies.Add(new Cookie(\"" + cookie.Item1 + "\", \"" + cookie.Item2 + "\"));");
    })

    this.extensions.SetResult("");

    this.extensions.SetResult("var cts = new CancellationTokenSource();");
    this.extensions.SetResult("await ws.ConnectAsync(new Uri(\"" + request.Url + "\"), cts.Token);");

    this.extensions._Indent = "    ";
    this.extensions.SetResult("}\n");

    return this.extensions.GetResult(this.extensions._Result);
  }
}
