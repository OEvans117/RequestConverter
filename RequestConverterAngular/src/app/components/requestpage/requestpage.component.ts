import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, Pipe, ViewChild, ViewEncapsulation } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { SRequest } from '../welcomepage/welcomepage.component';
import { CodeFormatter, CodeService } from '../../services/code.service';
import { CSharpHttpWebRequestFormatter } from '../../services/languages/csharp/httpwebrequest';
import { PythonRequestsFormatter } from '../../services/languages/python/requests';
import { RcapiService } from '../../services/rcapi.service';

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

  @ViewChild(CodemirrorComponent) codemirrorComponent: CodemirrorComponent | undefined;

  constructor(public rcApi: RcapiService, private codeService: CodeService) {
    this.codemirrorComponent?.codeMirror?.setSize(null, 100);
  }

  changeLanguage(language: string) {
    this.currentLanguage = language;
    this.rcApi.CurrentTranslatedRequest = this.codeService.format(this.currentRequest, language)
  }

  onSelected(value: string): void {
    let requestObj = this.rcApi.RequestArray.find((j: { url: string; }) => j.url === value);
    this.currentRequest = requestObj as SRequest;
    this.rcApi.CurrentTranslatedRequest = this.codeService.format(this.currentRequest, this.currentLanguage)
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
