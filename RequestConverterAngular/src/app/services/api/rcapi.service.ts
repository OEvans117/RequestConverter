import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { CodeService } from '../code/code.service';
import { Location } from '@angular/common';
import { Notyf } from 'notyf';
import { SettingsService } from '../settings.service';
import { isDevMode } from '@angular/core';
import { SRequest } from '../request/request';

@Injectable({ providedIn: 'root' })
export class RcapiService {

  constructor(private http: HttpClient,
    private codeService: CodeService,
    private location: Location,
    private rcSettings: SettingsService)
  {
    if (isDevMode())
      this.ApiBaseUrl = "https://localhost:7027"
  }

  BaseUrl: string = "https://asp.frenziedsms.com/"
  ApiBaseUrl: string = this.BaseUrl + "RequestConverter";

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
        this.rcSettings.RequestArray = resp as SRequest[]; // remove this and just use codeservice
        this.codeService.RequestBundle = resp as SRequest[];

        this.codeService.CurrentRequestIndex = 0;
        this.rcSettings.CurrentTranslatedRequest = this.codeService.format(this.codeService.CurrentLanguage)
    });
  }

  public SaveState() {
    this.http.post(this.ApiBaseUrl + "/Save", this.rcSettings.UnescapedRequestArray, { responseType:"text" })
      .pipe(catchError(this.HandleError)).subscribe(resp => {
        this.HasLoadedState = true;
        this.StateID = resp;
        this.location.go("/r/" + resp);
        new Notyf({ duration: 10000, ripple: true, position: { x: 'right', y: 'top' } })
          .success("Succesfully saved state ✅")
    });
  }

  public SetState(id: string) {
    this.http.get(this.ApiBaseUrl + "/Get?Id=" + id)
      .pipe(catchError(this.HandleLoadStateError)).subscribe(resp => {
        this.HasLoadedState = true;
        this.rcSettings.RequestArray = resp as SRequest[];
        this.rcSettings.CurrentTranslatedRequest = this.codeService.format(this.codeService.CurrentLanguage)
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
