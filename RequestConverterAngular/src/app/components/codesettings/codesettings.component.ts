import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpFormatter, CodeService } from '../../services/code/code.service';
import { CSharpHttpWebRequestFormatter } from '../../services/code/languages/csharp/httpwebrequest';
import { PythonRequestsFormatter } from '../../services/code/languages/python/requests';
import { RcapiService } from '../../services/api/rcapi.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'codesettings',
  templateUrl: './codesettings.component.html',
  styleUrls: ['./codesettings.component.css'],
  
})
export class CodesettingsComponent implements OnChanges {

  constructor(public rcApi: RcapiService,
    public codeService: CodeService,
    public rcSettings: SettingsService) {
    //this.rcApi.CurrentTranslatedRequest = this.codeService.format()
  }

  numSequence(n: number): Array<any> {
    return this.childProperties.slice(0, n);
  }

  requestedSettings: any;
  @Input() numberOfSettings: any;

  @Input() parentClass: any;
  @Input() childClass: any;
  parentProperties: any[];
  childProperties: any[];

  refreshCode() {
    this.rcSettings.CurrentTranslatedRequest = this.codeService.format(this.codeService.CurrentLanguage)
  }

  ngOnInit() {
    this.parentProperties = Object.keys(this.parentClass)
      .filter(key => !(typeof key === 'string' && key.charAt(0) === '_'))
      .map(prop => {
        return {
          name: prop,
          type: typeof this.parentClass[prop],
          value: this.parentClass[prop]
        };
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['childClass'] && changes['childClass'].currentValue) {
      this.childProperties = Object.keys(changes['childClass'].currentValue)
        .filter(p => p != "language")
        .filter(key => !(typeof key === 'string' && key.charAt(0) === '_'))
        .map(prop => {
          return {
            name: prop,
            type: typeof changes['childClass'].currentValue[prop],
            value: changes['childClass'].currentValue[prop]
          };
        });
    }
  }
  addSpaceBetweenCapital(propName: string): string {
    return propName.replace(/([A-Z])/g, ' $1').trim();
  }
}
