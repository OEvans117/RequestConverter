import { Injectable } from '@angular/core';
import { SRequest } from './request/request';
import { RequestModification } from './request/requestmethods';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  LaunchPreferences: boolean = false;

  CurrentTranslatedRequest: string;

  // Store unescaped version for API use.
  public UnescapedRequestArray: SRequest[];
  private _RequestArray: SRequest[] = [];

  public get RequestArray() {
    return this._RequestArray;
  }
  public set RequestArray(srequest: SRequest[]) {

    // Store unescaped copy (not reference) for API usage.
    this.UnescapedRequestArray = JSON.parse(JSON.stringify(srequest));
    this._RequestArray = srequest;

    new RequestModification(this._RequestArray).ModifyRequestArray();
  }
}
