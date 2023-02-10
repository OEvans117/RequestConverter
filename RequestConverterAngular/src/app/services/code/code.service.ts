import { Component, Inject, Injectable, Input } from '@angular/core';
import { RequestType, SRequest } from '../request/request';
import { CSharpWebsocketFormatter } from './languages/csharp/csharpwebsocket';
import { PythonWebsocketFormatter } from './languages/python/pythonwebsocket';
import { PythonRequestsFormatter } from './languages/python/pythonrequests';

@Injectable({ providedIn: 'root' })
export class CodeService {
  constructor(
    @Inject(HttpFormatter) public httpFormatters: HttpFormatter[],
    @Inject(WebsocketFormatter) private wsFormatters: WebsocketFormatter[],
    @Inject(FormatterExtension) private fmExtensions: FormatterExtension[],
    ) { }

  // Public modifyable settings
  public ShowAllRequests: boolean = true;

  // Private settings
  public RequestBundle: SRequest[];
  public CurrentRequestIndex: number = 0;
  public CurrentLanguage: string = "Requests";

  public currentHttpFormatter: HttpFormatter | undefined;
  public currentWebsocketFormatter: WebsocketFormatter | undefined;
  public currentFormattingExtension: FormatterExtension | undefined;

  format(language:string): string {

    //this.fmExtensions.ResetFunctionNames();

    this.CurrentLanguage = language;

    // Http formatters can be subsets of a language (eg: c#_http1, c#_http2), so get 1st part
    this.currentHttpFormatter = this.httpFormatters.find(c => c._name === language);
    this.currentWebsocketFormatter = this.wsFormatters.find(w => w.language === this.currentHttpFormatter!.language.split('_')[0]);
    this.currentFormattingExtension = this.fmExtensions.find(e => e._Language === this.currentHttpFormatter!.language);

    // Set the extension class for websockets & http.
    this.currentHttpFormatter?.SetExtension(this.currentFormattingExtension!);
    this.currentWebsocketFormatter?.SetExtension(this.currentFormattingExtension!);

    if (this.ShowAllRequests) {
      this.currentFormattingExtension!.SetHasValues(this.RequestBundle);
      this.currentFormattingExtension!.SetDefaultHeaders(this.RequestBundle);
      this.currentFormattingExtension!.SetDefaultCookies(this.RequestBundle);
      this.currentFormattingExtension!.SetDefaultUrl(this.RequestBundle);
      this.currentFormattingExtension!._ClassWrap = true;

      return this.all(language);
    }
    else {
      let request = this.RequestBundle[this.CurrentRequestIndex];
      this.currentFormattingExtension!.SetHasValues([request]);
      this.currentFormattingExtension!.SetDefaultHeaders(this.RequestBundle);
      this.currentFormattingExtension!.SetDefaultCookies(this.RequestBundle);
      this.currentFormattingExtension!.SetDefaultUrl(this.RequestBundle);
      this.currentFormattingExtension!._ClassWrap = false;

      return this.single(request, language);
    }
  }

  private all(language: string): string {

    this.currentFormattingExtension!.WriteAboveRequests()

    this.RequestBundle.forEach(request => {
      this.currentFormattingExtension!.SetResult(this.single(request, language));
    })

    this.currentFormattingExtension!.WriteBelowRequests()

    return this.currentFormattingExtension!.GetResult(this.currentFormattingExtension!._Result);
  }
  private single(request:SRequest, language: string): string {

    if (request.RequestType == RequestType.WEBSOCKET) {
      return this.currentWebsocketFormatter!.websocket(request);
    }
    else {
      return this.currentHttpFormatter!.request(request);
    }
  }
}

@Injectable({ providedIn: 'root' })
export abstract class FormatterExtension {
  abstract _Language: string;

  // Syntax modification variables
  public ClassName: string = "CustomRequests";
  public _ClassWrap: boolean = true;
  public _FunctionWrap: boolean = true;

  // Functions for writing code
  public _Result: string[] = [];
  public _Indent: string = "";
  public SetResult = (value: string) => this._Result.push(this._Indent + value);
  public GetResult(value: string[]): string {
    this._Result = [];
    this._Indent = "";
    return value.join("\n")
  }

  // Functions for writing code syntax
  abstract WriteAboveRequests(): void;
  abstract WriteBelowRequests(): void;

  // Set _HasWebsocket && _HasHttpRequest
  public _HasWebsocket: boolean = false;
  public _HasHttpRequest: boolean = false;
  SetHasValues(requests: SRequest[]) {
    this._HasWebsocket = (requests.some(r => r.RequestType == RequestType.WEBSOCKET))
    this._HasHttpRequest = (requests.some(r => r.RequestType != RequestType.WEBSOCKET))
  }

  // Methods for DefaultHeaders & DefaultCookies
  private FilterByCount(array: Array<any>, count: number) {
    return array.filter((a, index) =>
      array.indexOf(a) === index &&
      array.reduce((acc, b) => +(a === b) + acc, 0) === count
    );
  }
  public SubtractArrayElements(array: Array<any>, array2: Array<any>) {
    return array.filter(one => {
      return !array2.find(two => {
        return JSON.stringify(one) === JSON.stringify(two);
      });
    });
  }

  // Set DefaultHeaders
  public _DefaultHeaders: Array<any> = [];
  public SetDefaultHeaders(requests: SRequest[]) {
    if (requests.length == 1)
      return;

    let headers: { Item1: string; Item2: string; }[] = [];
    requests.forEach(request => {
      request.Headers.forEach(header => {
        headers.push(header);
      });
    });

    let repeatedHeaders = this.FilterByCount(headers.map(header => JSON.stringify(header)), requests.length);
    this._DefaultHeaders = repeatedHeaders.map(header => JSON.parse(header));
  }

  // Set DefaultCookies
  public _DefaultCookies: Array<any> = [];
  public SetDefaultCookies(requests: SRequest[]) {
    if (requests.length == 1)
      return;

    let cookies: { Item1: string; Item2: string; }[] = [];
    requests.forEach(request => {
      request.Cookies.forEach(cookie => {
        cookies.push(cookie);
      });
    });

    let repeatedCookies = this.FilterByCount(cookies.map(header => JSON.stringify(header)), requests.length);
    this._DefaultCookies = repeatedCookies.map(header => JSON.parse(header));
  }

  // Set DefaultUrl
  public _DefaultUrl: string = "";
  public SetDefaultUrl(requests: SRequest[]) {
    if (requests.length == 1)
      return;

    this._DefaultUrl = "";
    if (this.FilterByCount(requests.map(r => r.Url), requests.length).length > 0) {
      this._DefaultUrl = requests[0].Url;
    }
  }
}

export abstract class HttpFormatter {
  constructor(public _name: string,
    public language: string) { }

  public extensions: FormatterExtension;
  SetExtension(extensions: FormatterExtension) {
    this.extensions = extensions;
  }

  abstract request(request: SRequest): string;
}

export abstract class WebsocketFormatter {

  constructor(public language: string) { }

  public extensions: FormatterExtension;
  SetExtension(extensions: FormatterExtension) {
    this.extensions = extensions;
  }

  abstract websocket(request: SRequest): string;
}
