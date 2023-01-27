import { Injectable } from '@angular/core';
import { SRequest } from '../components/welcomepage/welcomepage.component';

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

    this._RequestArray.forEach(req => {
      // Replace new lines with \n & quotation marks with \
      if (req.RequestBody != null) {
        // fix this. \\n doesn't work for our use case. we want \n!
        req.RequestBody = req.RequestBody.replace(/\r?\n/g, "\\n");
        req.RequestBody = this.AddSlashes(req.RequestBody); // replace slashes 
      }

      req.Headers.forEach(header => header.Item2 = this.AddSlashes(header.Item2))
      req.Cookies.forEach(cookie => cookie.Item2 = this.AddSlashes(cookie.Item2))
    });
  }

  private AddSlashes = (str: string) => (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');

}
