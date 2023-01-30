
export interface SRequest {
  Cookies: Array<{ Item1: string, Item2: string }>;
  Headers: Array<{ Item1: string, Item2: string }>;
  RequestBody: string;
  RequestBodyInfo: RequestBody;
  RequestID: string;
  RequestType: RequestType;
  Url: string;
}

export enum RequestType {
  GET,
  HEAD,
  POST,
  PUT,
  DELETE,
  CONNECT,
  OPTIONS,
  TRACE,
  PATCH,
  WEBSOCKET
}

export abstract class RequestBody {
  Type: RequestBodyTypes;
  public BodyString: string;
}

export class Textplain extends RequestBody {
  override Type = RequestBodyTypes.TEXTPLAIN;
}

export class Multipart extends RequestBody {
  constructor(formData: MultipartFormData[]) {
    super();
    this.FormData = formData;
  }

  override Type = RequestBodyTypes.MULTIPART;
  FormData: MultipartFormData[];
}

export class MultipartFormData {
  constructor(name: string, value: string, filename: string = "") {
    this.Name = name;
    this.Value = value;

    if (filename != "") {
      this.Type = MultipartType.FileHeader;
      this.Filename = filename;
    }
    else {
      this.Type = MultipartType.Property;
    }
  }
  Name: string;
  Value: string;
  Filename: string;
  Type: MultipartType;
};

export class XWUrlFormEncoded extends RequestBody {
  constructor(formData: XWUrlFormData[]) {
    super();
    this.FormData = formData;
  }
  override Type = RequestBodyTypes.XWWWFORMURLENCODED;
  FormData: XWUrlFormData[];
}

export class XWUrlFormData {
  constructor(name: string, value: string) {
    this.Name = name;
    this.Value = value;
  }
  Name: string;
  Value: string;
}

export enum RequestBodyTypes {
  MULTIPART,
  XWWWFORMURLENCODED,
  TEXTPLAIN
}

export enum MultipartType {
  Property,
  FileHeader
}

