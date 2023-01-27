import { Injectable } from '@angular/core';
import { SRequest } from '../components/welcomepage/welcomepage.component';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  LaunchPreferences: boolean = false;

  _RequestArray: SRequest[] = [];

  public get RequestArray() {
    return this._RequestArray;
  }

  public set RequestArray(srequest: SRequest[]) {
    srequest.forEach(req => {
      // Replace new lines with \n
      // & quotation marks with \
      if (req.RequestBody != null) {
        req.RequestBody = req.RequestBody.replace(/\r?\n/g, "\\n");
        req.RequestBody = req.RequestBody.replace(/\r?\n/g, "\\n");
      }
    });

    this._RequestArray = srequest;
  }

  CurrentTranslatedRequest: string;
}
