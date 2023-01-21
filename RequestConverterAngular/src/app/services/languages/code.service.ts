import { Inject, Injectable } from '@angular/core';
import { SRequest } from '../../components/welcomepage/welcomepage.component';
import { PythonRequestsFormatter } from './python/requests';

@Injectable({ providedIn: 'root' })
export class CodeService {
  constructor(@Inject(CodeFormatter) private formatters: CodeFormatter[]) { }

  public RequestName: string | undefined = "yeah";
  public ShowAllRequests: boolean = false;
  public CurrentFormatter: CodeFormatter | undefined;

  format(request: SRequest, language: string): string {
    this.CurrentFormatter = this.formatters.find(f => f.language === language);
    return this.CurrentFormatter!.format(request);
  }
}

export abstract class CodeFormatter {
  constructor(public language: string) { }
  abstract format(request: SRequest): string;
}
