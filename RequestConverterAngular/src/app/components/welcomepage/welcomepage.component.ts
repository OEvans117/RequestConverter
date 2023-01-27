import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { RcapiService } from '../../services/api/rcapi.service';

@Component({
  selector: 'welcomepage',
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

  visitExample() {
    location.href = window.location.href + "r/uezu51";
  }

  visitUrl(value: string) {
    location.href = value;
  }
}

export interface SRequest {
  Cookies: Array<{ Item1: string, Item2: string }>;
  Headers: Array<{ Item1: string, Item2: string }>;
  RequestBody: string;
  RequestID: string;
  RequestType: RequestType;
  Url: string;
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
