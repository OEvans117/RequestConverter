import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { Location } from '@angular/common';
import { HttpFormatter, CodeService, WebsocketFormatter, FormatterExtension } from './services/code/code.service';
import { PythonRequestsFormatter } from './services/code/languages/python/requests';
import { CSharpHttpWebRequestFormatter } from './services/code/languages/csharp/httpwebrequest';
import { SettingsService } from './services/settings.service';
import { RcapiService } from './services/api/rcapi.service';
import { CSharpWebsocketFormatter } from './services/code/languages/csharp/csharpwebsocket';
import { PythonWebsocketFormatter } from './services/code/languages/python/pythonwebsocket';
import { CSharpExtension } from './services/code/languages/csharp/csharpextension';
import { PythonExtension } from './services/code/languages/python/pythonextension';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [RcapiService, CodeService,
    { provide: HttpFormatter, useClass: PythonRequestsFormatter, multi: true },
    { provide: HttpFormatter, useClass: CSharpHttpWebRequestFormatter, multi: true },
    { provide: WebsocketFormatter, useClass: PythonWebsocketFormatter, multi: true },
    { provide: WebsocketFormatter, useClass: CSharpWebsocketFormatter, multi: true },
    { provide: FormatterExtension, useClass: CSharpExtension, multi: true },
    { provide: FormatterExtension, useClass: PythonExtension, multi: true },
  ],
})
export class AppComponent {

  UrlParameters: string[];

  constructor(private codeService: CodeService,
    public rcApi: RcapiService,
    public rcSettings: SettingsService,
    private location: Location) {
    codeService.currentHttpFormatter = new PythonRequestsFormatter();
    // Load state from API if path contains url parameters
    this.UrlParameters = this.location.path().split('/');
    if (this.UrlParameters.length > 1) {
      rcApi.SetState(this.UrlParameters[2]);
    }
  }
}
