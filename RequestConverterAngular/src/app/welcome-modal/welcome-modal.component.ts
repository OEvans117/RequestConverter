import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.css']
})
export class WelcomeModalComponent {

  @Output() emitJson = new EventEmitter<any>();

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {

    const reqFile: File = event.target.files[0];

    if (reqFile) {
      const formData = new FormData();
      formData.append('file', reqFile, reqFile.name);
      const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
      this.http.post("https://localhost:7182/UploadFile", formData, { headers }).subscribe(resp => {
        this.emitJson.emit(resp as SRequest[]);
      });
    }
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
