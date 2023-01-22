import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, Pipe, ViewChild, ViewEncapsulation } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { SRequest } from '../welcomepage/welcomepage.component';
import { CodeFormatter, CodeService } from '../../services/languages/code.service';
import { CSharpHttpWebRequestFormatter } from '../../services/languages/csharp/httpwebrequest';
import { PythonRequestsFormatter } from '../../services/languages/python/requests';
import { RcapiService } from '../../services/rcapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'requestpage',
  templateUrl: './requestpage.component.html',
  styleUrls: ['./requestpage.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [CodeService,
    { provide: CodeFormatter, useClass: PythonRequestsFormatter, multi: true },
    { provide: CodeFormatter, useClass: CSharpHttpWebRequestFormatter, multi: true },
  ]
})

export class RequestpageComponent {
  currentRequest: any;
  currentLanguage: any = "requests";
  currentUrl: string;

  @ViewChild(CodemirrorComponent) codemirrorComponent: CodemirrorComponent | undefined;

  constructor(public rcApi: RcapiService, public codeService: CodeService, private router: Router) {
    this.codeService.CurrentLanguage = "requests";
    this.codemirrorComponent?.codeMirror?.setSize(null, 100);
  }

  // When you click on language buttons
  changeLanguage(language: string) {
    if (this.codeService.CurrentLanguage != language) {
      this.rcApi.CurrentTranslatedRequest = this.codeService.format(language, this.rcApi.RequestArray);
    }
  }

  codeMirrorOptions: any = {
    mode: 'python',
    autoRefresh: true,
    styleActiveLine: true,
    lineNumbers: true,
    lineWrapping: true,
    autoCloseTags: true,
    foldGutter: true,
    dragDrop: true,
    lint: true,
    theme: 'nord'
  };
}
