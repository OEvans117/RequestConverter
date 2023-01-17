import { RequestType, SRequest } from "../../welcome-modal/welcome-modal.component";
import { CodeFormatter } from "../code.service";

export class PythonFormatter extends CodeFormatter {
  constructor() { super('python'); }
  format(request: SRequest): string {
    let PythonResult: string = "";

    PythonResult += "reqHeaders = OrderedDict([";
    PythonResult += "\n";

    request.headers.forEach(function (header) {
      PythonResult += "    (\"" + header.item1 + "\", \"" + header.item2 + "\"),\n"
    });

    PythonResult += "])\n\n";

    if (request.requestType == RequestType.GET) {
      PythonResult += "customReq = RequestSession.get('" + request.url + "', proxies =" +
        " Account.ProxyDict, cookies = Account.CookieDict, headers = reqHeaders, verify = False)\n";
      PythonResult += "customResponse = customReq.text";
    }

    if (request.requestType == RequestType.POST) {
      PythonResult += "reqBody = \"" + request.requestBody + "\"\n";
      PythonResult += "customReq = RequestSession.post('" + request.url + "', data = reqBody, proxies =" +
        " Account.ProxyDict, cookies = Account.CookieDict, headers = reqHeaders, verify = False)\n";
      PythonResult += "customResponse = customReq.text";
    }

    return PythonResult;
  }
}
