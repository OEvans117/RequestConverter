import { Component, Inject, Injectable, Input } from '@angular/core';
import { RequestType, SRequest } from '../request/request';
import { CSharpWebsocketFormatter } from './languages/csharp/csharpwebsocket';
import { PythonWebsocketFormatter } from './languages/python/pythonwebsocket';
import { PythonRequestsFormatter } from './languages/python/requests';

@Injectable({ providedIn: 'root' })
export class CodeService {
  constructor(
    @Inject(HttpFormatter) private httpFormatters: HttpFormatter[],
    @Inject(WebsocketFormatter) private wsFormatters: WebsocketFormatter[],
    @Inject(FormatterExtension) private fmExtensions: FormatterExtension[],
    ) { }

  // Public modifyable settings
  public ShowAllRequests: boolean = true;

  // Private settings
  public RequestBundle: SRequest[];
  public CurrentRequestIndex: number = 0;
  public CurrentLanguage: string = "requests";

  public currentHttpFormatter: HttpFormatter | undefined;
  private currentWebsocketFormatter: WebsocketFormatter | undefined;
  private currentFormattingExtension: FormatterExtension | undefined;

  format(language:string): string {

    //this.fmExtensions.ResetFunctionNames();

    this.CurrentLanguage = language;

    this.currentHttpFormatter = this.httpFormatters.find(c => c.name === language);
    this.currentWebsocketFormatter = this.wsFormatters.find(w => w.language === this.currentHttpFormatter!.language);
    this.currentFormattingExtension = this.fmExtensions.find(e => e.Language === this.currentHttpFormatter!.language);

    // Set the extension class for websockets & http.
    this.currentHttpFormatter?.SetExtension(this.currentFormattingExtension!);
    this.currentWebsocketFormatter?.SetExtension(this.currentFormattingExtension!);

    if (this.ShowAllRequests) {
      this.currentFormattingExtension!.SetHasOptions(this.RequestBundle);
      this.currentFormattingExtension!.SetDuplicateHeaders(this.RequestBundle);

      return this.all(language);
    }
    else {
      let request = this.RequestBundle[this.CurrentRequestIndex];
      this.currentFormattingExtension!.SetHasOptions([request]);
      this.currentFormattingExtension!.SetDuplicateHeaders(this.RequestBundle);

      return this.single(request, language);
    }
  }

  private all(language: string): string {

    this.currentFormattingExtension!.writeclass()

    this.RequestBundle.forEach(request => {

      this.currentFormattingExtension!.writehttpmethod(request)
      this.currentFormattingExtension!.SetResult(this.single(request, language));
      this.currentFormattingExtension!.writeclosemethod()
    })

    this.currentFormattingExtension!.writecloseclass()
    return this.currentFormattingExtension!.GetResult(this.currentFormattingExtension!._Result);
  }
  private single(request:SRequest, language: string): string {

    if (request.RequestType == RequestType.WEBSOCKET)
      return this.currentWebsocketFormatter!.websocket(request);
    else
      return this.currentHttpFormatter!.request(request);
  }
}

@Injectable({ providedIn: 'root' })
export abstract class FormatterExtension {
  abstract Language: string;

  // Syntax modification variables
  public ClassWrap: boolean = true;
  public ClassName: string = "CustomRequests";
  public FunctionWrap: boolean = true;

  // Functions for writing code syntax
  abstract writeimports(): void;
  abstract writeclass(): void;
  abstract writehttpmethod(request: SRequest): void;
  abstract writewsmethod(request: SRequest): void;
  abstract writeclosemethod(): void;
  abstract writecloseclass(): void;

  // Has variables (check for websocket etc)
  // Helps write methods
  public HasWebsocket: boolean = false;
  public HasHttpRequest: boolean = false;
  SetHasOptions(requests: SRequest[]) {
    this.HasWebsocket = (requests.some(r => r.RequestType == RequestType.WEBSOCKET))
    this.HasHttpRequest = (requests.some(r => r.RequestType != RequestType.WEBSOCKET))
  }

  // Functions for code creation
  public _Result: string[] = [];
  public _Indent: string = "";
  public SetResult = (value: string) => this._Result.push(this._Indent + value);
  public GetResult(value: string[]): string {
    this._Result = [];
    this._Indent = "";
    return value.join("\n")
  }

  // Set default headers in libraries
  public DuplicateHeaders: Array<any>;
  private FilterByCount(array: Array<any>, count: number) {
    return array.filter((a, index) =>
      array.indexOf(a) === index &&
      array.reduce((acc, b) => +(a === b) + acc, 0) === count
      );
  }
  public SetDuplicateHeaders(requests:SRequest[]) {

    let HeaderList = new Array<{ Item1: string, Item2: string }>();

    requests.forEach(request => { request.Headers.forEach(header => { HeaderList.push(header); }) })

    let values = HeaderList.map(item => JSON.stringify(item));
    let repeatedelems = this.FilterByCount(values, requests.length);

    HeaderList = []

    repeatedelems.forEach(dup => { HeaderList.push(JSON.parse(dup)); })

    this.DuplicateHeaders = HeaderList;
  }
}

export abstract class HttpFormatter {
  constructor(public name: string,
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
