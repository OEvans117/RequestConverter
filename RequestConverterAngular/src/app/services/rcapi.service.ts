import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SRequest } from '../components/welcomepage/welcomepage.component';
import { CodeService } from './code.service';
import { Location } from '@angular/common';
import { Notyf } from 'notyf';

@Injectable({
  providedIn: 'root'
})
export class RcapiService {

  constructor(private http: HttpClient,
    private codeService: CodeService,
    private location: Location,
    ) { }

  BaseUrl: string = "https://asp.frenziedsms.com/"
  ApiBaseUrl: string = this.BaseUrl + "RequestConverter";

  RequestArray: SRequest[];
  CurrentTranslatedRequest: string;
  StateID: string;
  StateURL: string;
  HasLoadedState: boolean = false;

  public ConvertFile(RequestFile: File) {
    const FileFormData = new FormData();
    FileFormData.append('file', RequestFile, RequestFile.name);

    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');

    this.http.post(this.ApiBaseUrl + "/Convert", FileFormData, { headers })
      .pipe(catchError(this.HandleError)).subscribe(resp => {
      this.RequestArray = resp as SRequest[];
      this.CurrentTranslatedRequest = this.codeService.format(this.RequestArray[0], "requests")
    });
  }

  public SaveState() {
    this.http.post(this.ApiBaseUrl + "/Save", this.RequestArray, { responseType:"text" })
      .pipe(catchError(this.HandleError)).subscribe(resp => {
        this.StateID = resp;
        this.HasLoadedState = true;

        this.location.go("/r/" + resp);
        const notyf = new Notyf();
        notyf.options.duration = 10000;
        notyf.options.ripple = true;
        notyf.options.position = { x: 'right', y: 'top' }
        notyf.success('Succesfully saved state ✅');
    });
  }

  public SetState(id: string) {
    this.HasLoadedState = true;
    this.http.get(this.ApiBaseUrl + "/Get?Id=" + id)
      .pipe(catchError(this.HandleLoadStateError)).subscribe(resp => {
        this.RequestArray = resp as SRequest[];
        this.HasLoadedState = true;
    });
  }

  private HandleError(error: HttpErrorResponse) {
    if (error.status === 0)
      console.error('An error occurred:', error.error);
    else
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private HandleLoadStateError(error: HttpErrorResponse) {
    this.HasLoadedState = false;
    if (error.status === 0)
      console.error('An error occurred:', error.error);
    else
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
