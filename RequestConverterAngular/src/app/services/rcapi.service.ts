import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SRequest } from '../welcome-modal/welcome-modal.component';
import { CodeService } from './code.service';

@Injectable({
  providedIn: 'root'
})
export class RcapiService {

  constructor(private http: HttpClient, private codeService: CodeService) { }

  RequestArray: SRequest[];
  CurrentTranslatedRequest: string;

  public ConvertFile(RequestFile: File) {
    const FileFormData = new FormData();
    FileFormData.append('file', RequestFile, RequestFile.name);

    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');

    this.http.post("https://asp.frenziedsms.com/RequestConverter/Convert", FileFormData, { headers }).subscribe(resp => {
      this.RequestArray = (resp as SRequest[]);
      this.CurrentTranslatedRequest = this.codeService.format(this.RequestArray[0], "requests")
    });
  }
}
