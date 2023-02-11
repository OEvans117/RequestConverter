import { SRequest } from "../../../request/request";
import { WebsocketFormatter } from "../../code.service";

export class NodeJSWebsocketFormatter extends WebsocketFormatter {

  constructor() { super('NodeJS'); }

  websocket(request: SRequest): string {

    let headers: Record<string, string> = {};
    request.Headers.forEach(header => {
      headers[header.Item1] = header.Item2;
    });

    this.extensions.SetResult("const WebSocket = require('ws');\n");
    this.extensions.SetResult("const client = new WebSocket('" + request.Url + "', { headers: " + JSON.stringify(headers) + " });\n");
    this.extensions.SetResult("\nclient.on('open', function open() {\n");
    this.extensions.SetResult("  console.log('Connected to server');\n");
    this.extensions.SetResult("});\n");
    this.extensions.SetResult("\nclient.on('message', function incoming(data) {\n");
    this.extensions.SetResult("  console.log('Received data:', data);\n");
    this.extensions.SetResult("});\n");
    this.extensions.SetResult("\nclient.on('close', function close() {\n");
    this.extensions.SetResult("  console.log('Disconnected from server');\n");
    this.extensions.SetResult("});\n");

    return this.extensions.GetResult(this.extensions._Result);
  }
}
