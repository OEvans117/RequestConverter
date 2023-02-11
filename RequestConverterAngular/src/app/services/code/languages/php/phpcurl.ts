import { Multipart, MultipartType, RequestBody, RequestBodyTypes, RequestType, SRequest, XWUrlFormData, XWUrlFormEncoded } from "../../../request/request";
import { HttpFormatter, CodeService } from "../../code.service";

export class PHPCURLRequestsFormatter extends HttpFormatter {
  constructor() { super('Curl', 'PHP'); }

  public HeaderName: string = "headers";
  public RequestName: string = "request";
  public ResponseName: string = "response";

  request(request: SRequest): string {

    this.extensions.SetResult("    function " + request.RequestMethodName + "() {")
    this.extensions._Indent = "        ";

    this.extensions.SetResult("$" + this.HeaderName + " = array(");

    request.Headers.forEach((header) => {
      // In PHP, files = formData will already set the header automatically.
      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART && header.Item1.toLowerCase() == "content-type")
        return;

      this.extensions.SetResult("    \"" + header.Item1 + "\" => \"" + header.Item2 + "\",");
    });

    this.extensions.SetResult(");\n");

    if (request.RequestType == RequestType.POST) {

      if (request.RequestBodyInfo.Type == RequestBodyTypes.MULTIPART) {
        let multipart = (request.RequestBodyInfo as Multipart);

        this.extensions.SetResult("$formData = array(");

        multipart.FormData.forEach(mpfd => {
          if (mpfd.Type == MultipartType.Property) {
            this.extensions.SetResult("    \"" + mpfd.Name + "\" => \"" + mpfd.Value + "\",");
          }
          else if (mpfd.Type == MultipartType.FileHeader) {
            this.extensions.SetResult("    \"" + mpfd.Name + "\" => new CURLFile(\"" + mpfd.Name + "\"),");
          }
        })

        this.extensions.SetResult(");");

        this.extensions.SetResult("$" + this.RequestName + " = curl_init('" + request.Url + "');");
        this.extensions.SetResult("curl_setopt_array($" + this.RequestName + ", array(");
        this.extensions.SetResult("    CURLOPT_POST => 1,");
        this.extensions.SetResult("    CURLOPT_RETURNTRANSFER => true,");
        this.extensions.SetResult("    CURLOPT_POSTFIELDS => $formData,");
        this.extensions.SetResult("    CURLOPT_HTTPHEADER => $" + this.HeaderName);
        this.extensions.SetResult("));");
      }
      else if (request.RequestBodyInfo.Type == RequestBodyTypes.XWWWFORMURLENCODED) {
        let xwwwformurlencoded = (request.RequestBodyInfo as XWUrlFormEncoded);
        this.extensions.SetResult("$reqBody = array(");
        xwwwformurlencoded.FormData.forEach(data =>
          this.extensions.SetResult("    \"" + data.Name + "\" => \"" + data.Value + "\","));
        this.extensions.SetResult(");");
        this.extensions.SetResult("$" + this.RequestName + " = curl_init('" + request.Url + "');");
        this.extensions.SetResult("curl_setopt_array($" + this.RequestName + ", array(");
        this.extensions.SetResult("    CURLOPT_POST => 1,");
        this.extensions.SetResult("    CURLOPT_RETURNTRANSFER => true,");
        this.extensions.SetResult("    CURLOPT_POSTFIELDS => $reqBody,");
        this.extensions.SetResult("    CURLOPT_HTTPHEADER => $" + this.HeaderName);
        this.extensions.SetResult("));");
      }
      else {
        this.extensions.SetResult("$reqBody = \"" + request.RequestBody + "\";");
        this.extensions.SetResult("$" + this.RequestName + " = curl_init('" + request.Url + "');");
        this.extensions.SetResult("curl_setopt_array($" + this.RequestName + ", array(");
        this.extensions.SetResult("    CURLOPT_POST => 1,");
        this.extensions.SetResult("    CURLOPT_RETURNTRANSFER => true,");
        this.extensions.SetResult("    CURLOPT_POSTFIELDS => $reqBody,");
        this.extensions.SetResult("    CURLOPT_HTTPHEADER => $" + this.HeaderName);
        this.extensions.SetResult("));");
      }
    }
    else {
      this.extensions.SetResult("$" + this.RequestName + " = curl_init('" + request.Url + "');");
      this.extensions.SetResult("curl_setopt_array($" + this.RequestName + ", array(");
      this.extensions.SetResult("    CURLOPT_RETURNTRANSFER => true,");
      this.extensions.SetResult("    CURLOPT_HTTPHEADER => $" + this.HeaderName);
      this.extensions.SetResult("));");
    }

    this.extensions.SetResult("$" + this.ResponseName + " = curl_exec($" + this.RequestName + ");");
    this.extensions.SetResult("curl_close($" + this.RequestName + ");");

    this.extensions._Indent = "    ";
    this.extensions.SetResult("}\n");

    return this.extensions.GetResult(this.extensions._Result);
  }
}
