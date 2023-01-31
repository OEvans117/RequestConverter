import { SRequest } from "../../../request/request";
import { WebsocketFormatter, FormatterExtensions } from "../../code.service";

export class CSharpWebsocketFormatter extends WebsocketFormatter {
  constructor() { super('csharp'); }

  override getWebsocketString(request: SRequest): string {
    super.FormatterExtensions.SetResult("hello");

    return super.getWebsocketString(request);
  }
}
