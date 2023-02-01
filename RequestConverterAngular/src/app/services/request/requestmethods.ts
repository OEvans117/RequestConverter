import { parseMultipart } from "@ssttevee/multipart-parser";
import { Multipart, MultipartFormData, MultipartType, RequestBody, SRequest, Textplain, XWUrlFormData, XWUrlFormEncoded } from "./request";
import { Busboy } from "busboy";
import * as qs from "querystring";

export class RequestModification {
  RequestBundle: SRequest[]

  constructor(requestBundle: SRequest[]) {
    this.RequestBundle = requestBundle
  }

  // Replace new lines with \n & quotation marks with \
  public ModifyRequestArray():void {
    this.RequestBundle.forEach(req => {

      // Set content type (multipart/xwww)
      this.SetContentType(req);

      // Set method name!
      req.RequestMethodName = this.GetFunctionName(req.Url);

      // Replace quotes with \
      if (req.RequestBody != null) {
        req.RequestBody = req.RequestBody.replace(/\r?\n/g, "\\n");
        req.RequestBody = this.AddSlashes(req.RequestBody);
      }

      // Add slashes
      req.Headers.forEach(header => header.Item2 = this.AddSlashes(header.Item2));
      req.Cookies.forEach(cookie => cookie.Item2 = this.AddSlashes(cookie.Item2));
    });
  }

  private SetContentType(req: SRequest) {
    var contentType = req.Headers.find(header => header.Item1.toLowerCase() === "content-type");
    if (contentType !== undefined) {

      if (contentType.Item2.includes("multipart/form-data"))
      {
        req.RequestBodyInfo = new Multipart(this.ExtractValuesFromMultipartFormData(req.RequestBody));
        return;
      }
      else if (contentType.Item2.includes("application/x-www-form-urlencoded"))
      {
        req.RequestBodyInfo = new XWUrlFormEncoded(this.ExtractValuesFromXWWWUrlEncoded(req.RequestBody));
        return;
      }
    }

    req.RequestBodyInfo = new Textplain();
  }

  // Get names for functions
  private _FunctionNames: string[] = [];
  public GetFunctionName(url: string): string {

    url = url.replace(/^(https?|ftp):\/\/*/, ''); // remove the protocol/scheme
    url = url.replace(/\..{2,6}\/\//, ''); // remove the domain extension
    url = url.replace(/\.com/, '');
    url = url.replace(/^www\./, ''); // remove the "www"
    url = url.replace(/[^a-zA-Z0-9]/g, '.'); // replace non-alphanumeric characters with a dot

    // convert each element of the array to start with an uppercase character
    let urlArr = url.split('.').map(val => val.charAt(0).toUpperCase() + val.slice(1));

    let urlString = "";
    for (let i = 0; i < urlArr.length; i++) {
      urlString += urlArr[i]; // add array element

      // check if the current url is already stored
      if (!this._FunctionNames.includes(urlString)) {
        this._FunctionNames.push(urlString);
        return urlString;
      }
    }

    // have exhausted all paths & url parameters
    // so add index at the end

    // if array element already has number, add +1 to it
    urlString = urlString.replace(/\d$/, (n) => n + 1)

    return urlString;
  }
  public ResetFunctionNames = () => this._FunctionNames = [];

  // this function needs reworking.
  // insomnia is sending double line content-disposition & content-type
  // after the boundary. it means i need to find a different way to parse this.
  private ExtractValuesFromMultipartFormData(requestBody: string): MultipartFormData[] {
    const lines = requestBody.match(/[^\r\n]+/g)!;
    let currentLine = 0;
    const result: MultipartFormData[] = [];
    while (currentLine < lines.length) {
      const line = lines[currentLine];
      if (line.startsWith('Content-Disposition: form-data;')) {
        currentLine += 1;
        const name = line.match(/name="([^"]+)"/)![1];
        const filename = line.match(/filename="([^"]+)"/);
        let currentMpfd: MultipartFormData;
        // if filename is null, add formdata as property instead of file
        filename === null ? currentMpfd = new MultipartFormData(name, this.AddSlashes(lines[currentLine]))
          : currentMpfd = new MultipartFormData(name, this.AddSlashes(lines[currentLine]), filename[1]);
        result.push(currentMpfd);
      }
      currentLine++;
    }
    return result;
  }

  private ExtractValuesFromXWWWUrlEncoded(requestBody: string): XWUrlFormData[] {
    let formValues: qs.ParsedUrlQuery = qs.decode(requestBody);
    let formValuesArray: XWUrlFormData[] = [];
    Object.entries(formValues).forEach(([name, value]) => {
      if (name !== "" && value !== undefined) {
        formValuesArray.push(new XWUrlFormData(name, value as string));
      }
    });
    return formValuesArray;
  }

  private AddSlashes = (str: string) => (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}
