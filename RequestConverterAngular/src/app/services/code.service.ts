import { Inject, Injectable } from '@angular/core';
import { SRequest } from '../components/welcomepage/welcomepage.component';

@Injectable({
  providedIn: 'root'
})
export class CodeService {
  constructor(@Inject(CodeFormatter) private formatters: CodeFormatter[]) {}

  format(request: SRequest, language: string): string {
    const formatter = this.formatters.find(f => f.language === language);
    return formatter!.format(request);
  }
}

export abstract class CodeFormatter {
  constructor(public language: string) { }
  abstract format(request: SRequest): string;
}
