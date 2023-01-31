import { Component, Inject, Injectable, Input } from '@angular/core';
import { RequestType, SRequest } from '../request/request';
import { CSharpWebsocketFormatter } from './languages/csharp/csharpwebsocket';
import { PythonWebsocketFormatter } from './languages/python/pythonwebsocket';
import { PythonRequestsFormatter } from './languages/python/requests';

@Injectable({ providedIn: 'root' })
export class CodeService {
  constructor(@Inject(CodeFormatter) private formatters: CodeFormatter[]) { }

  // Public modifyable settings
  public ShowAllRequests: boolean = true;

  // Private settings
  public CurrentRequest: number = 0;
  public CurrentLanguage: string = "requests";
  public CurrentFormatter: CodeFormatter | undefined;

  format(language:string, RequestBundle: SRequest[]): string {

    this.CurrentLanguage = language;
    this.CurrentFormatter = this.formatters.find(c => c.name === language);
    this.CurrentFormatter?.extensions.ResetFunctionNames();

    // If show all requests, set class wrap to true. Otherwise, to false.
    this.ShowAllRequests ? this.CurrentFormatter!.ClassWrap = true : this.CurrentFormatter!.ClassWrap = false;

    if (this.ShowAllRequests)
      return this.CurrentFormatter!.all(RequestBundle);
    else
      return this.CurrentFormatter!.single(RequestBundle[this.CurrentRequest])
  }
}

export class FormatterExtensions {
  // Functions for code creation
  public _Result: string[] = [];
  public _Indent: string = "";
  public SetResult = (value: string) => this._Result.push(this._Indent + value);
  public GetResult(value: string[]): string {
    this._Result = [];
    this._Indent = "";
    return value.join("\n")
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
}

export class FormatterOptions {
  public constructor(ClassWrap: boolean, ClassName: string, FunctionWrap: boolean) {
    this.ClassWrap = ClassWrap,
      this.ClassName = ClassName,
      this.FunctionWrap = FunctionWrap
  }
  public ClassWrap: boolean = true;
  public ClassName: string = "CustomRequests";
  public FunctionWrap: boolean = true;
}

export abstract class CodeFormatter {
  constructor(public name: string, public wsformatter: WebsocketFormatter) { }
  
  public ClassWrap: boolean = true;
  public ClassName: string = "CustomRequests";
  public FunctionWrap: boolean = true;

  public options = new FormatterOptions(
    true, "CustomClass", true);
  public extensions = new FormatterExtensions();

  abstract all(requests: SRequest[]): string;
  abstract request(request: SRequest): string;
  single(request: SRequest): string {
    return request.RequestType == RequestType.WEBSOCKET
      ? this.wsformatter.GetWebsocketString(request, this.options)
      : this.request(request);
  }
}

export interface WebsocketFormatter {
  GetWebsocketString(request: SRequest, options: FormatterOptions): string;
  FormatterExtensions: FormatterExtensions;
}
