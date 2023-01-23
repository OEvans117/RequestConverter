import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  LaunchPreferences: boolean = false;

  constructor() { }
}
