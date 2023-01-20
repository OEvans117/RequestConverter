import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SRequest } from '../components/welcomepage/welcomepage.component';
import { CodeService } from './code.service';

@Injectable({
  providedIn: 'root'
})
export class RcapiService {

  constructor(private http: HttpClient, private codeService: CodeService) { }

  ApiBaseUrl: string = "https://asp.frenziedsms.com/RequestConverter";

  JsonResponse: string;
  RequestArray: SRequest[];
  CurrentTranslatedRequest: string;

  public ConvertFile(RequestFile: File) {
    const FileFormData = new FormData();
    FileFormData.append('file', RequestFile, RequestFile.name);

    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');

    this.http.post(this.ApiBaseUrl + "/Convert", FileFormData, { headers })
      .pipe(catchError(this.HandleError)).subscribe(resp => {
      this.RequestArray = resp as SRequest[];
      this.JsonResponse = resp as string;
      this.CurrentTranslatedRequest = this.codeService.format(this.RequestArray[0], "requests")
    });
  }

  public SaveState(): string {
    const headers = new HttpHeaders().append('Content-Type', 'text/plain');

    this.http.post(this.ApiBaseUrl + "/Save", this.JsonResponse, { headers })
      .pipe(catchError(this.HandleError)).subscribe(resp => {
      return resp;
    });

    return "Error";
  }

  public GetState(id: string): string {
    this.http.get(this.ApiBaseUrl + "/Get?Id=" + id)
      .pipe(catchError(this.HandleError)).subscribe(resp => {
      return resp;
    });

    return "Error";
  }

  private HandleError(error: HttpErrorResponse) {
    if (error.status === 0)
      console.error('An error occurred:', error.error);
    else
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
