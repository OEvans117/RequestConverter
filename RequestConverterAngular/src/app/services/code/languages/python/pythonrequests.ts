import { Multipart, MultipartType, RequestBody, RequestBodyTypes, RequestType, SRequest, XWUrlFormData, XWUrlFormEncoded } from "../../../request/request";
import { HttpFormatter, CodeService } from "../../code.service";
import { PythonWebsocketFormatter } from "./pythonwebsocket";

export class PythonRequestsFormatter extends HttpFormatter {
  constructor() { super('Requests', 'Python'); }

  public HeaderName: string = "reqHeaders";
  public RequestName: string = "reqName";
  public ResponseName: string = "respName";

  request(request: SRequest): string {

    this.extensions.SetResult("    def " + request.RequestMethodName + "():")
    this.extensions._Indent = "        ";

    this.extensions.SetResult(this.HeaderName + " = OrderedDict({");

    request.Headers.forEach((header) => {
      // In python, files = formData will already set the header automatically.
      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART && header.Item1.toLowerCase() == "content-type")
        return;

      this.extensions.SetResult("    \"" + header.Item1 + "\": \"" + header.Item2 + "\",");
    });

    this.extensions.SetResult("})\n");

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
          this.extensions.SetResult("    \"" + data.Name + "\": \"" + data.Value + "\","));
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

    this.extensions.SetResult("");

    return this.extensions.GetResult(this.extensions._Result);
  }
}
