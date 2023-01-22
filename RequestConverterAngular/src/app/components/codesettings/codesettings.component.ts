import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CodeFormatter, CodeService } from '../../services/languages/code.service';
import { CSharpHttpWebRequestFormatter } from '../../services/languages/csharp/httpwebrequest';
import { PythonRequestsFormatter } from '../../services/languages/python/requests';
import { RcapiService } from '../../services/rcapi.service';
import { SRequest } from '../welcomepage/welcomepage.component';

@Component({
  selector: 'codesettings',
  templateUrl: './codesettings.component.html',
  styleUrls: ['./codesettings.component.css'],
  providers: [CodeService,
    { provide: CodeFormatter, useClass: PythonRequestsFormatter, multi: true },
    { provide: CodeFormatter, useClass: CSharpHttpWebRequestFormatter, multi: true },
  ],
})
export class CodesettingsComponent implements OnChanges {

  constructor(public rcApi: RcapiService,
    public codeService: CodeService) {
    //this.rcApi.CurrentTranslatedRequest = this.codeService.format()
  }

  @Input() parentClass: any;
  @Input() childClass: any;
  parentProperties: any[];
  childProperties: any[];

  refreshCode() {
    this.rcApi.CurrentTranslatedRequest = this.codeService.format(this.codeService.CurrentLanguage, this.rcApi.RequestArray)
  }

  // When you select a URL from the option
  onSelected(value: string): void {
    this.codeService.CurrentRequest = this.rcApi.RequestArray.findIndex((j: { url: string; }) => j.url === value);
    this.refreshCode();
  }

  ngOnInit() {
    this.parentProperties = Object.keys(this.parentClass)
      .filter(p => p != "CurrentFormatter" && p != "formatters" && p != "CurrentLanguage")
      .map(prop => {
        return {
          name: prop,
          type: typeof this.parentClass[prop]
        };
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['childClass'] && changes['childClass'].currentValue) {
      this.childProperties = Object.keys(changes['childClass'].currentValue)
        .filter(p => p != "language")
        .map(prop => {
          return {
            name: prop,
            type: typeof changes['childClass'].currentValue[prop]
          };
        });
    }
  }
  addSpaceBetweenCapital(propName: string): string {
    return propName.replace(/([A-Z])/g, ' $1').trim();
  }
}
