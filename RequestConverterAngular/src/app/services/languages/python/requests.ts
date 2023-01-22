import { RequestType, SRequest } from "../../../components/welcomepage/welcomepage.component";
import { CodeFormatter, CodeService } from "../code.service";

export class PythonRequestsFormatter extends CodeFormatter {
  constructor() { super('requests'); }

  public HeaderName: string = "reqHeaders";
  public RequestName: string = "reqName";
  public ResponseName: string = "respName";

  request(request: SRequest): string {
    let PythonResult: string = "";

    PythonResult += this.HeaderName + " = OrderedDict([";
    PythonResult += "\n";

    request.headers.forEach(function (header) {
      PythonResult += "    (\"" + header.item1 + "\", \"" + header.item2 + "\"),\n"
    });

    PythonResult += "])\n\n";

    if (request.requestType == RequestType.GET) {
      PythonResult += this.RequestName + " = RequestSession.get('" + request.url + "', headers = reqHeaders)\n";
      PythonResult += this.ResponseName + " = customReq.text";
    }

    if (request.requestType == RequestType.POST) {
      PythonResult += "reqBody = \"" + request.requestBody + "\"\n";
      PythonResult += this.RequestName + " = RequestSession.post('" + request.url + "', data = reqBody, headers = reqHeaders)\n";
      PythonResult += this.ResponseName + " = customReq.text";
    }

    return PythonResult;
  }

  requests(requests: SRequest[]): string {

    let PythonResult: string = "";
    let RequestIndex: number = 0;

    requests.forEach(request => {
      RequestIndex += 1;

      PythonResult += "def Method" + RequestIndex.toString() + "():\n";
      PythonResult += "    " + this.HeaderName + " = OrderedDict([";
      PythonResult += "\n";

      request.headers.forEach(function (header) {
        PythonResult += "        (\"" + header.item1 + "\", \"" + header.item2 + "\"),\n"
      });

      PythonResult += "    ])\n\n";

      if (request.requestType == RequestType.GET) {
        PythonResult += "    " + this.RequestName + " = RequestSession.get('" + request.url + "', headers = reqHeaders)\n";
        PythonResult += "    " + this.ResponseName + " = customReq.text";
      }

      if (request.requestType == RequestType.POST) {
        PythonResult += "    reqBody = \"" + request.requestBody + "\"\n";
        PythonResult += "    " + this.RequestName + " = RequestSession.post('" + request.url + "', data = reqBody, headers = reqHeaders)\n";
        PythonResult += "    " + this.ResponseName + " = customReq.text";
      }

      PythonResult += "\n\n";
    })

    return PythonResult;
  }

  format(requests: SRequest[], index: number): string {
    return "";
  }
}
