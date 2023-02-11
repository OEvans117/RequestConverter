import { SRequest } from "../../../request/request";
import { WebsocketFormatter, FormatterExtension } from "../../code.service";

export class PHPWebsocketFormatter extends WebsocketFormatter {

  constructor() { super('PHP'); }

  websocket(request: SRequest): string {

    // https://github.com/Textalk/websocket-php/blob/master/docs/Client.md#examples

    this.extensions.SetResult("function " + request.RequestMethodName + "()")
    this.extensions.SetResult("{");
    this.extensions._Indent = "        ";

    this.extensions.SetResult("$client = new WebSocket\Client(\"" + request.Url + "\", [");
    this.extensions._Indent = "            "

    this.extensions.SetResult("headers' => [");
    this.extensions._Indent = "                "

    request.Headers.forEach(header => {
      this.extensions.SetResult("'" + header.Item1 + "' => '" + header.Item2 + "',");
    })

    this.extensions.SetResult("'timeout' => 60,");
    this.extensions._Indent = "            "
    this.extensions.SetResult("]);\n")

    this.extensions.SetResult("while (true) {");
    this.extensions.SetResult("    try {");
    this.extensions.SetResult("        $message = $client->receive();");
    this.extensions.SetResult("        // Break while loop to stop listening");
    this.extensions.SetResult("    } catch (\WebSocket\ConnectionException $e) {");
    this.extensions.SetResult("        // Possibly log errors");
    this.extensions.SetResult("    }");
    this.extensions.SetResult("}");
    this.extensions.SetResult("$client->close();");

    this.extensions._Indent = "    ";
    this.extensions.SetResult("}\n");

    return this.extensions.GetResult(this.extensions._Result);
  }
}
