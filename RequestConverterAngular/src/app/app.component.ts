import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { Location } from '@angular/common';
import { HttpFormatter, CodeService, WebsocketFormatter, FormatterExtension } from './services/code/code.service';
import { PythonRequestsFormatter } from './services/code/languages/python/pythonrequests';
import { SettingsService } from './services/settings.service';
import { RcapiService } from './services/api/rcapi.service';
import { CSharpWebsocketFormatter } from './services/code/languages/csharp/csharpwebsocket';
import { PythonWebsocketFormatter } from './services/code/languages/python/pythonwebsocket';
import { PythonExtension } from './services/code/languages/python/pythonextension';
import { CSharpHttpClientFormatter, CSharpHttpClientExtension } from './services/code/languages/csharp/csharphttpclient';
import { CSharpHttpWebRequestFormatter, HttpWebRequestExtension } from './services/code/languages/csharp/chsarphttpwebrequest';
import { Meta } from '@angular/platform-browser';
import { PHPWebsocketFormatter } from './services/code/languages/php/phpwebsocket';
import { PHPCURLRequestsFormatter } from './services/code/languages/php/phpcurl';
import { PhpExtension } from './services/code/languages/php/phpextension';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [RcapiService, CodeService,
    { provide: WebsocketFormatter, useClass: PythonWebsocketFormatter, multi: true },
    { provide: WebsocketFormatter, useClass: CSharpWebsocketFormatter, multi: true },
    { provide: WebsocketFormatter, useClass: PHPWebsocketFormatter, multi: true },

    { provide: HttpFormatter, useClass: PythonRequestsFormatter, multi: true },
    { provide: HttpFormatter, useClass: CSharpHttpWebRequestFormatter, multi: true },
    { provide: HttpFormatter, useClass: CSharpHttpClientFormatter, multi: true },
    { provide: HttpFormatter, useClass: PHPCURLRequestsFormatter, multi: true },

    { provide: FormatterExtension, useClass: HttpWebRequestExtension, multi: true },
    { provide: FormatterExtension, useClass: PythonExtension, multi: true },
    { provide: FormatterExtension, useClass: CSharpHttpClientExtension, multi: true },
    { provide: FormatterExtension, useClass: PhpExtension, multi: true },
  ],
})
export class AppComponent {

  UrlParameters: string[];

  constructor(private codeService: CodeService,
    public rcApi: RcapiService,
    public rcSettings: SettingsService,
    private location: Location,
    private metaService: Meta) {
    codeService.currentHttpFormatter = new PythonRequestsFormatter();
    // Load state from API if path contains url parameters
    this.UrlParameters = this.location.path().split('/');
    if (this.UrlParameters.length > 1) {
      rcApi.SetState(this.UrlParameters[2]);
    }
  }
}
