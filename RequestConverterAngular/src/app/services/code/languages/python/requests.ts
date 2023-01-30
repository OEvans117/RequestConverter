import { Multipart, MultipartType, RequestBody, RequestBodyTypes, RequestType, SRequest, XWUrlFormData, XWUrlFormEncoded } from "../../../request/request";
import { CodeFormatter, CodeService } from "../../code.service";

export class PythonRequestsFormatter extends CodeFormatter {
  constructor() { super('requests'); }

  public HeaderName: string = "reqHeaders";
  public RequestName: string = "reqName";
  public ResponseName: string = "respName";

  request(request: SRequest): string {

    if (this.FunctionWrap) {

      if (this.ClassWrap) {
        this._Indent = "    ";
        this.SetResult("def req_" + this.GetFunctionName(request.Url) + "():")
        this._Indent = "        ";
      }
      else {
        this.SetResult("def req_" + this.GetFunctionName(request.Url) + "():")
        this._Indent = "    ";
      }
    }

    this.SetResult(this.HeaderName + " = OrderedDict([");

    request.Headers.forEach((header) => {
      // In python, files = formData will already set the header automatically.
      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART && header.Item1.toLowerCase() == "content-type")
        return;

      this.SetResult("    (\"" + header.Item1 + "\", \"" + header.Item2 + "\"),");
    });

    this.SetResult("])\n");

    if (request.RequestType == RequestType.POST) {

      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART) {
        let multipart = (request.RequestBodyInfo as Multipart);

        this.SetResult("formData = (");

        multipart.FormData.forEach(mpfd => {
          if (mpfd.Type == MultipartType.Property) {
            this.SetResult("    (\"" + mpfd.Name + "\", (None, \"" + mpfd.Value + "\")),");
          }
          else if (mpfd.Type == MultipartType.FileHeader) {
            this.SetResult("    (\"file\", (" + mpfd.Name + ", open('" + mpfd.Name + "'))),");
          }
        })

        this.SetResult(")");

        this.SetResult(this.RequestName + " = requests.post('" + request.Url + "', files = formData, headers = reqHeaders)");
      }
      else if (request.RequestBodyInfo.Type == RequestBodyTypes.XWWWFORMURLENCODED) {
        let xwwwformurlencoded = (request.RequestBodyInfo as XWUrlFormEncoded);
        this.SetResult("reqBody = {")
        xwwwformurlencoded.FormData.forEach(data =>
          this.SetResult("    \"" + data.Name + ": \"" + data.Value + "\","));
        this.SetResult("}")
        this.SetResult(this.RequestName + " = requests.post('" + request.Url + "', data = reqBody, headers = reqHeaders)");
      }
      else {
        this.SetResult("reqBody = \"" + request.RequestBody + "\"");
        this.SetResult(this.RequestName + " = requests.post('" + request.Url + "', data = reqBody, headers = reqHeaders)");
      }
    }
    else {
      this.SetResult(this.RequestName + " = requests." + RequestType[request.RequestType].toLowerCase() + "('" + request.Url + "', headers = reqHeaders)");
    }

    this.SetResult(this.ResponseName + " = reqName.text");

    return this.GetResult(this._Result);
  }

  requests(requests: SRequest[]): string {

    let requeststrings: string[] = [];

    if (this.ClassWrap) {
      this.SetResult("import requests")
      this.SetResult("from collections import OrderedDict\n")
      this.SetResult("class " + this.ClassName + ":");
      this._Indent = "    ";
    }

    requests.forEach(request => {
      requeststrings.push(this.request(request) + "\n");
    })

    return this.GetResult(requeststrings);
  }
}
