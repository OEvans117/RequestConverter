import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { Location } from '@angular/common';
import { CodeFormatter, CodeService } from './services/code/code.service';
import { PythonRequestsFormatter } from './services/code/languages/python/requests';
import { CSharpHttpWebRequestFormatter } from './services/code/languages/csharp/httpwebrequest';
import { SettingsService } from './services/settings.service';
import { RcapiService } from './services/api/rcapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ RcapiService, CodeService, 
    { provide: CodeFormatter, useClass: PythonRequestsFormatter, multi: true },
    { provide: CodeFormatter, useClass: CSharpHttpWebRequestFormatter, multi: true },
  ],
})
export class AppComponent {

  UrlParameters: string[];

  constructor(private codeService: CodeService,
    public rcApi: RcapiService,
    public rcSettings: SettingsService,
    private location: Location) {
    codeService.CurrentFormatter = new PythonRequestsFormatter();
    // Load state from API if path contains url parameters
    this.UrlParameters = this.location.path().split('/');
    if (this.UrlParameters.length > 1) {
      rcApi.SetState(this.UrlParameters[2]);
    }
  }
}
