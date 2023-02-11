import { SRequest } from "../../../request/request";
import { WebsocketFormatter, FormatterExtension } from "../../code.service";

export class JavaWebsocketFormatter extends WebsocketFormatter {

  constructor() { super('C#'); }

  websocket(request: SRequest): string {

    // https://github.com/Textalk/websocket-php/blob/master/docs/Client.md#examples

    this.extensions.SetResult("public void " + request.RequestMethodName + " throws Exception {")
    this.extensions._Indent = "        ";

    this.extensions.SetResult("ClientEndpointConfig.Builder configBuilder = ClientEndpointConfig.Builder.create();");
    this.extensions.SetResult("configBuilder.configurator(new ClientEndpointConfig.Configurator() {");
    this.extensions.SetResult("    public void beforeRequest(Map<String, List<String>> headers) {");
    request.Headers.forEach(header => {
      this.extensions.SetResult("        headers.put(\"" + header.Item1 + "\", Arrays.asList(\"" + header.Item2 + "\"));");
    })
    this.extensions.SetResult("    }");
    this.extensions.SetResult("});");


    this.extensions.SetResult("ClientEndpointConfig clientConfig = configBuilder.build();");
    this.extensions.SetResult("WebSocketContainer container = ContainerProvider.getWebSocketContainer();");
    this.extensions.SetResult("container.connectToServer(this, clientConfig, URI.create(uri));");

    this.extensions._Indent = "    ";
    this.extensions.SetResult("}\n");

    return this.extensions.GetResult(this.extensions._Result);
  }
}
