import { Inject, Injectable } from '@angular/core';
import { SRequest } from '../../components/welcomepage/welcomepage.component';
import { PythonRequestsFormatter } from './python/requests';

@Injectable({ providedIn: 'root' })
export class CodeService {
  constructor(@Inject(CodeFormatter) private formatters: CodeFormatter[]) { }

  // Public modifyable settings
  public ShowAllRequests: boolean = true; // keep this as last for HTML
  public FunctionWrap: boolean = true; // wrap requests around functions;

  // Private settings
  public CurrentRequest: number = 0;
  public CurrentLanguage: string = "requests";
  public CurrentFormatter: CodeFormatter | undefined;

  format(language:string, RequestBundle: SRequest[]): string {

    this.CurrentLanguage = language;
    this.CurrentFormatter = this.formatters.find(f => f.language === language);

    if (this.ShowAllRequests)
      return this.CurrentFormatter!.requests(RequestBundle);
    else
      return this.CurrentFormatter!.request(RequestBundle[this.CurrentRequest], this.FunctionWrap)
  }
}

export abstract class CodeFormatter {
  constructor(public language: string) { }

  public Result: string[] = [];
  public _Indent: string = "";
  public SetResult = (value: string) => this.Result.push(this._Indent + value);
  public GetResult(value: string[]): string {
    this.Result = [];
    this._Indent = "";
    return value.join("\n")
  }

  abstract requests(requests: SRequest[]): string;
  abstract request(request: SRequest, functionwrap: boolean): string;
}
