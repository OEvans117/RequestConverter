import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, Pipe, ViewChild, ViewEncapsulation } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { HttpFormatter, CodeService } from '../../services/code/code.service';
import { PythonRequestsFormatter } from '../../services/code/languages/python/pythonrequests';
import { RcapiService } from '../../services/api/rcapi.service';
import { Router } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { AppModule } from '../../app.module';
import { Location } from '@angular/common';

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
    public settings: SettingsService,
    private location: Location,
    public rcSettings: SettingsService) {
    this.codemirrorComponent?.codeMirror?.setSize(null, 100);
  }

  refreshCode() {
    this.rcSettings.CurrentTranslatedRequest = this.codeService.format(this.codeService.CurrentLanguage)
  }

  // When you select a URL from the option
  onSelected(): void {
    this.codeService.CurrentRequestIndex = this.rcSettings.RequestArray.findIndex((j: { RequestID: string; }) => j.RequestID === this.currentRequest.RequestID);
    this.refreshCode();
  }

  // When you click on language buttons
  changeLanguage(language: string) {
    if (this.codeService.CurrentLanguage != language) {
      this.rcSettings.CurrentTranslatedRequest = this.codeService.format(language);
    }
  }

  resetRequests(): void {
    this.location.go("")
    this.rcSettings.RequestArray = [];
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
