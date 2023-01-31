import { SRequest } from "../../../request/request";
import { WebsocketFormatter, FormatterExtensions } from "../../code.service";

export class PythonWebsocketFormatter extends WebsocketFormatter {
  constructor() { super('python'); }

  override getWebsocketString(request: SRequest): string {
    super.FormatterExtensions.SetResult("python");

    return super.getWebsocketString(request);
  }
}
