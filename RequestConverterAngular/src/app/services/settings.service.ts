import { Injectable } from '@angular/core';
import { RequestType, SimpleSRequest, SRequest } from './request/request';
import { RequestModification } from './request/requestmethods';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  ShowPreferences: boolean = false;

  ShowJsonViewer: boolean = false;

  CurrentTranslatedRequest: string;

  // Store unescaped version for API use.
  public UnescapedRequestArray: SRequest[];
  public SimplifiedRequestArray: SimpleSRequest[] = [];
  private _RequestArray: SRequest[] = [];

  public get RequestArray() {
    return this._RequestArray;
  }
  public set RequestArray(srequest: SRequest[]) {

    // Store unescaped copy (not reference) for API usage.
    this.UnescapedRequestArray = JSON.parse(JSON.stringify(srequest));

    this.SimplifiedRequestArray = []
    this.UnescapedRequestArray.forEach(request => {
      let simpleReq = new SimpleSRequest();
      simpleReq.RequestType = RequestType[request.RequestType];
      simpleReq.Url = request.Url;
      simpleReq.Headers = request.Headers;
      simpleReq.Cookies = request.Cookies;
      simpleReq.RequestBody = request.RequestBody;
      this.SimplifiedRequestArray.push(simpleReq )
    })

    this._RequestArray = srequest;

    new RequestModification(this._RequestArray).ModifyRequestArray();
  }
}
