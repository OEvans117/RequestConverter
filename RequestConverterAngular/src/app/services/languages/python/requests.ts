import { RequestType, SRequest } from "../../../components/welcomepage/welcomepage.component";
import { CodeFormatter } from "../../code.service";

export class PythonRequestsFormatter extends CodeFormatter {
  constructor() { super('requests'); }
  format(request: SRequest): string {
    let PythonResult: string = "";

    PythonResult += "reqHeaders = OrderedDict([";
    PythonResult += "\n";

    request.headers.forEach(function (header) {
      PythonResult += "    (\"" + header.item1 + "\", \"" + header.item2 + "\"),\n"
    });

    PythonResult += "])\n\n";

    if (request.requestType == RequestType.GET) {
      PythonResult += "customReq = RequestSession.get('" + request.url + "', headers = reqHeaders)\n";
      PythonResult += "customResponse = customReq.text";
    }

    if (request.requestType == RequestType.POST) {
      PythonResult += "reqBody = \"" + request.requestBody + "\"\n";
      PythonResult += "customReq = RequestSession.post('" + request.url + "', data = reqBody, headers = reqHeaders)\n";
      PythonResult += "customResponse = customReq.text";
    }

    return PythonResult;
  }
}
