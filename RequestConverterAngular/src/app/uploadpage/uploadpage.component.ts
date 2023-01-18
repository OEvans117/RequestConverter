import { HttpClient } from '@angular/common/http';
import { Component, Input, Output } from '@angular/core';
import { CodeFormatter, CodeService } from '../services/code.service';
import { CSharpHttpWebRequestFormatter } from '../services/languages/csharp/httpwebrequest';
import { PythonRequestsFormatter } from '../services/languages/python/requests';
import { SRequest } from '../welcome-modal/welcome-modal.component';

@Component({
  selector: 'uploadpage',
  templateUrl: './uploadpage.component.html',
  styleUrls: ['./uploadpage.component.css'],
  providers: [CodeService,
    { provide: CodeFormatter, useClass: PythonRequestsFormatter, multi: true },
    { provide: CodeFormatter, useClass: CSharpHttpWebRequestFormatter, multi: true },
  ]
})
export class UploadpageComponent {
  jsonResp: SRequest[];
  currentTranslatedRequest: any;

  constructor(private codeService: CodeService) {}

  testy(event: SRequest[]) {
    this.jsonResp = event;
    this.currentTranslatedRequest = this.codeService.format(this.jsonResp[0] as SRequest, "requests")
  }
}
