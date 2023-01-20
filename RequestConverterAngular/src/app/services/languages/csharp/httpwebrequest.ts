import { RequestType, SRequest } from "../../../components/welcomepage/welcomepage.component";
import { CodeFormatter } from "../../code.service";

export class CSharpHttpWebRequestFormatter extends CodeFormatter {
  constructor() { super('httpwebrequest'); }
  format(request: SRequest): string {
    let PythonResult: string = "";

    PythonResult += "HttpWebRequest cbReq = WebRequest.CreateHttp(\"" + request.url + "\");\n\n";

    request.headers.forEach(function (header) {
      PythonResult += "cbReq.Headers.Add(\"" + header.item1 + ", \"" + header.item2 + "\");\n"
    });

    PythonResult += "\n";

    if (request.requestType == RequestType.GET) {

    }

    if (request.requestType == RequestType.POST) {

    }

    PythonResult += "using (var sr = new StreamReader(req.GetResponse().GetResponseStream()))\n";
    PythonResult += "    return sr.ReadToEnd();";
    return PythonResult;
  }
}
