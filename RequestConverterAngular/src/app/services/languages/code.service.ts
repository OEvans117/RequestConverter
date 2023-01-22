import { Inject, Injectable } from '@angular/core';
import { SRequest } from '../../components/welcomepage/welcomepage.component';
import { PythonRequestsFormatter } from './python/requests';

@Injectable({ providedIn: 'root' })
export class CodeService {
  constructor(@Inject(CodeFormatter) private formatters: CodeFormatter[]) { console.log("created!"); }

  // Public modifyable settings
  public ShowAllRequests: boolean; // keep this as last for HTML
  
  // Private settings
  public CurrentRequest: number = 0;
  public CurrentLanguage: string;
  public CurrentFormatter: CodeFormatter | undefined;

  format(language:string, RequestBundle: SRequest[]): string {

    this.CurrentLanguage = language;
    this.CurrentFormatter = this.formatters.find(f => f.language === language);

    if (this.ShowAllRequests)
      return this.CurrentFormatter!.requests(RequestBundle);
    else
      return this.CurrentFormatter!.request(RequestBundle[this.CurrentRequest])
  }
}

export abstract class CodeFormatter {
  constructor(public language: string) { }
  abstract format(requests: SRequest[], index: number): string;
  abstract requests(requests: SRequest[]): string;
  abstract request(request: SRequest): string;
}
