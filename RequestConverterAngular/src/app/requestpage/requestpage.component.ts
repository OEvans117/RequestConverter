import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, Pipe, ViewChild, ViewEncapsulation } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { CsharpPipe } from '../pipes/csharp.pipe';
import { PythonPipe } from '../pipes/python.pipe';
import { SRequest } from '../welcome-modal/welcome-modal.component';
import { CodeFormatter, CodeService } from '../services/code.service';
import { CSharpFormatter } from '../services/languages/csharp'
import { PythonFormatter } from '../services/languages/python'

@Component({
  selector: 'requestpage',
  templateUrl: './requestpage.component.html',
  styleUrls: ['./requestpage.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ CodeService,
    { provide: CodeFormatter, useClass: PythonFormatter, multi: true },
    { provide: CodeFormatter, useClass: CSharpFormatter, multi: true },
  ]
})

export class RequestpageComponent {
  @Input() jsonResp: SRequest[];
  currentRequest: any;
  currentTranslatedRequest: any = "";

  @ViewChild(CodemirrorComponent) codemirrorComponent: CodemirrorComponent | undefined;

  constructor(private codeService: CodeService) {
    this.codemirrorComponent?.codeMirror?.setSize(null, 100);
  }

  changeLanguage(language: string) {
    this.currentTranslatedRequest = this.codeService.format(this.currentRequest, language)
  }

  onSelected(value: string): void {
    let requestObj = this.jsonResp.find((j: { url: string; }) => j.url === value);
    this.currentRequest = requestObj as SRequest;
    this.currentTranslatedRequest = this.codeService.format(this.currentRequest, "python")
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
