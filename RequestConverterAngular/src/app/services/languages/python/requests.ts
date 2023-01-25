import { RequestType, SRequest } from "../../../components/welcomepage/welcomepage.component";
import { CodeFormatter, CodeService } from "../code.service";

export class PythonRequestsFormatter extends CodeFormatter {
  constructor() { super('requests'); }

  public HeaderName: string = "reqHeaders";
  public RequestName: string = "reqName";
  public ResponseName: string = "respName";

  request(request: SRequest, functionwrap: boolean): string {

    if (functionwrap) {
      this.SetResult("def req_" + request.requestID.split('-')[0] + "():")
      this._Indent = "    ";
    }

    this.SetResult(this.HeaderName + " = OrderedDict([");

    request.headers.forEach( (header) => {
      this.SetResult("    (\"" + header.item1 + "\", \"" + header.item2 + "\"),");
    });

    this.SetResult("])\n");

    if (request.requestType == RequestType.GET) {
      this.SetResult(this.RequestName + " = RequestSession.get('" + request.url + "', headers = reqHeaders)");
      this.SetResult(this.ResponseName + " = customReq.text");
    }

    if (request.requestType == RequestType.POST) {
      this.SetResult("reqBody = \"" + request.requestBody + "\"");
      this.SetResult(this.RequestName + " = RequestSession.post('" + request.url + "', data = reqBody, headers = reqHeaders)");
      this.SetResult(this.ResponseName + " = customReq.text");
    }

    return this.GetResult(this.Result);
  }

  requests(requests: SRequest[]): string {

    let requeststrings: string[] = [];

    requests.forEach(request => {
      requeststrings.push(this.request(request, true) + "\n");
    })

    return this.GetResult(requeststrings);
  }
}
