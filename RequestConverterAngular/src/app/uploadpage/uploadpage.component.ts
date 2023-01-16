import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { SRequest } from '../welcome-modal/welcome-modal.component';

@Component({
  selector: 'uploadpage',
  templateUrl: './uploadpage.component.html',
  styleUrls: ['./uploadpage.component.css']
})
export class UploadpageComponent {
  jsonResp: SRequest[];

  testy(event: SRequest[]) {
    this.jsonResp = event;
  }
}
