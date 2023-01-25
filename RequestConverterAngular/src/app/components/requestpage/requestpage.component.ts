import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, Pipe, ViewChild, ViewEncapsulation } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { SRequest } from '../welcomepage/welcomepage.component';
import { CodeFormatter, CodeService } from '../../services/languages/code.service';
import { CSharpHttpWebRequestFormatter } from '../../services/languages/csharp/httpwebrequest';
import { PythonRequestsFormatter } from '../../services/languages/python/requests';
import { RcapiService } from '../../services/rcapi.service';
import { Router } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { AppModule } from '../../app.module';

@Component({
  selector: 'requestpage',
  templateUrl: './requestpage.component.html',
  styleUrls: ['./requestpage.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class RequestpageComponent {
  currentRequest: any;
  currentLanguage: any = "requests";
  currentUrl: string;

  @ViewChild(CodemirrorComponent) codemirrorComponent: CodemirrorComponent | undefined;

  constructor(public rcApi: RcapiService,
    public codeService: CodeService,
    private router: Router,
    public settings: SettingsService) {
    this.codemirrorComponent?.codeMirror?.setSize(null, 100);
  }

  refreshCode() {
    this.rcApi.CurrentTranslatedRequest = this.codeService.format(this.codeService.CurrentLanguage, this.rcApi.RequestArray)
  }

  // When you select a URL from the option
  onSelected(value: string): void {
    this.codeService.CurrentRequest = this.rcApi.RequestArray.findIndex((j: { url: string; }) => j.url === value);
    this.refreshCode();
  }

  // When you click on language buttons
  changeLanguage(language: string) {
    if (this.codeService.CurrentLanguage != language) {
      this.rcApi.CurrentTranslatedRequest = this.codeService.format(language, this.rcApi.RequestArray);
    }
  }

  resetRequests(): void {
    this.rcApi.RequestArray = [];
    this.rcApi.HasLoadedState = true;
  }

  codeMirrorOptions: any = {
    mode: 'text/x-csharp',
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
