import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { RcapiService } from '../../services/rcapi.service';

@Component({
  selector: 'app-welcomepage',
  templateUrl: './welcomepage.component.html',
  styleUrls: ['./welcomepage.component.css']
})
export class WelcomepageComponent {

  constructor(public rcApi: RcapiService) { }

  onFileSelected(event: any) {

    const RequestFile: File = event.target.files[0];

    if (RequestFile)
      this.rcApi.ConvertFile(RequestFile);
  }
}

export interface SRequest {
  cookies: Array<{ item1: string, item2: string }>;
  headers: Array<{ item1: string, item2: string }>;
  requestBody: string;
  requestID: string;
  requestType: RequestType;
  url: string;
}

export enum RequestType {
  GET,
  HEAD,
  POST,
  PUT,
  DELETE,
  CONNECT,
  OPTIONS,
  TRACE,
  PATCH
}
