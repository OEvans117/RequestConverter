import { Multipart, MultipartType, RequestBody, RequestBodyTypes, RequestType, SRequest, XWUrlFormData, XWUrlFormEncoded } from "../../../request/request";
import { CodeFormatter, CodeService } from "../../code.service";
import { PythonWebsocketFormatter } from "./pythonwebsocket";

export class PythonRequestsFormatter extends CodeFormatter {
  constructor() { super('requests', new PythonWebsocketFormatter()); }

  public HeaderName: string = "reqHeaders";
  public RequestName: string = "reqName";
  public ResponseName: string = "respName";

  request(request: SRequest): string {

    if (this.FunctionWrap) {
      if (this.ClassWrap) {
        this.extensions._Indent = "    ";
        this.extensions.SetResult("def req_" + this.extensions.GetFunctionName(request.Url) + "():")
        this.extensions._Indent = "        ";
      }
      else {
        this.extensions.SetResult("def req_" + this.extensions.GetFunctionName(request.Url) + "():")
        this.extensions._Indent = "    ";
      }
    }

    this.extensions.SetResult(this.HeaderName + " = OrderedDict([");

    request.Headers.forEach((header) => {
      // In python, files = formData will already set the header automatically.
      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART && header.Item1.toLowerCase() == "content-type")
        return;

      this.extensions.SetResult("    (\"" + header.Item1 + "\", \"" + header.Item2 + "\"),");
    });

    this.extensions.SetResult("])\n");

    if (request.RequestType == RequestType.POST) {

      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART) {
        let multipart = (request.RequestBodyInfo as Multipart);

        this.extensions.SetResult("formData = (");

        multipart.FormData.forEach(mpfd => {
          if (mpfd.Type == MultipartType.Property) {
            this.extensions.SetResult("    (\"" + mpfd.Name + "\", (None, \"" + mpfd.Value + "\")),");
          }
          else if (mpfd.Type == MultipartType.FileHeader) {
            this.extensions.SetResult("    (\"file\", (" + mpfd.Name + ", open('" + mpfd.Name + "'))),");
          }
        })

        this.extensions.SetResult(")");

        this.extensions.SetResult(this.RequestName + " = requests.post('" + request.Url + "', files = formData, headers = reqHeaders)");
      }
      else if (request.RequestBodyInfo.Type == RequestBodyTypes.XWWWFORMURLENCODED) {
        let xwwwformurlencoded = (request.RequestBodyInfo as XWUrlFormEncoded);
        this.extensions.SetResult("reqBody = {")
        xwwwformurlencoded.FormData.forEach(data =>
          this.extensions.SetResult("    \"" + data.Name + ": \"" + data.Value + "\","));
        this.extensions.SetResult("}")
        this.extensions.SetResult(this.RequestName + " = requests.post('" + request.Url + "', data = reqBody, headers = reqHeaders)");
      }
      else {
        this.extensions.SetResult("reqBody = \"" + request.RequestBody + "\"");
        this.extensions.SetResult(this.RequestName + " = requests.post('" + request.Url + "', data = reqBody, headers = reqHeaders)");
      }
    }
    else {
      this.extensions.SetResult(this.RequestName + " = requests." + RequestType[request.RequestType].toLowerCase() + "('" + request.Url + "', headers = reqHeaders)");
    }

    this.extensions.SetResult(this.ResponseName + " = reqName.text");

    return this.extensions.GetResult(this.extensions._Result);
  }
  all(requests: SRequest[]): string {

    let requeststrings: string[] = [];

    if (this.ClassWrap) {

      let hasWebsocket = (requests.some(r => r.RequestType == RequestType.WEBSOCKET))
      let hasHttpRequest = (requests.some(r => r.RequestType != RequestType.WEBSOCKET))

      // only add if there is a http request
      if (hasHttpRequest) {
        this.extensions.SetResult("import requests")
        this.extensions.SetResult("from collections import OrderedDict\n")
      }

      // only add if there is a websocket
      if (hasWebsocket) {
        this.extensions.SetResult("import websocket\n")
      }

      this.extensions.SetResult("class " + this.ClassName + ":");
      this.extensions._Indent = "    ";
    }

    requests.forEach(request => {
      if (request.RequestType == RequestType.WEBSOCKET) {
        requeststrings.push(this.wsformatter.GetWebsocketString(request, this.options));
      }
      else {
        requeststrings.push(this.request(request) + "\n");
      }
    })

    return this.extensions.GetResult(requeststrings);
  }
}
