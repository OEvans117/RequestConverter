import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { RcapiService } from './services/rcapi.service';
import { Location } from '@angular/common';
import { CodeFormatter, CodeService } from './services/languages/code.service';
import { PythonRequestsFormatter } from './services/languages/python/requests';
import { CSharpHttpWebRequestFormatter } from './services/languages/csharp/httpwebrequest';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CodeService,
    { provide: CodeFormatter, useClass: PythonRequestsFormatter, multi: true },
    { provide: CodeFormatter, useClass: CSharpHttpWebRequestFormatter, multi: true },
  ],
})
export class AppComponent {

}
