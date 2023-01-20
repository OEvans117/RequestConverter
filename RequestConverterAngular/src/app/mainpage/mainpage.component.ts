import { HttpClient } from '@angular/common/http';
import { Component, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { CodeFormatter, CodeService } from '../services/code.service';
import { CSharpHttpWebRequestFormatter } from '../services/languages/csharp/httpwebrequest';
import { PythonRequestsFormatter } from '../services/languages/python/requests';
import { SRequest } from '../welcome-modal/welcome-modal.component';
import { RcapiService } from '../services/rcapi.service';

@Component({
  selector: 'mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css'],
  providers: [RcapiService, CodeService,
    { provide: CodeFormatter, useClass: PythonRequestsFormatter, multi: true },
    { provide: CodeFormatter, useClass: CSharpHttpWebRequestFormatter, multi: true },
  ]
})
export class MainpageComponent {
  constructor(public rcApi: RcapiService, private codeService: CodeService, private location: Location) {
    console.log(this.location.path())
  }
}
