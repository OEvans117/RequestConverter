import { RequestType, SRequest } from "../../../components/welcomepage/welcomepage.component";
import { CodeFormatter, CodeService } from "../code.service";

export class PythonRequestsFormatter extends CodeFormatter {
  constructor() { super('requests'); }

  public HeaderName: string = "reqHeaders";
  public RequestName: string = "reqName";
  public ResponseName: string = "respName";

  request(request: SRequest, functionwrap: boolean): string {

    if (functionwrap) {
      this.SetResult("def req_" + request.RequestID.split('-')[0] + "():")
      this._Indent = "    ";
    }

    this.SetResult(this.HeaderName + " = OrderedDict([");

    request.Headers.forEach( (header) => {
      this.SetResult("    (\"" + header.Item1 + "\", \"" + header.Item2 + "\"),");
    });

    this.SetResult("])\n");

    if (request.RequestType == RequestType.POST) {
      this.SetResult("reqBody = \"" + request.RequestBody + "\"");
      this.SetResult(this.RequestName + " = RequestSession.post('" + request.Url + "', data = reqBody, headers = reqHeaders)");
      this.SetResult(this.ResponseName + " = customReq.text");
    }
    else {
      this.SetResult(this.RequestName + " = RequestSession." + RequestType[request.RequestType].toLowerCase() + "('" + request.Url + "', headers = reqHeaders)");
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
