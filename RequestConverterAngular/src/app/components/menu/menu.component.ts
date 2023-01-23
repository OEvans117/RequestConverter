import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { RcapiService } from '../../services/rcapi.service';
import { SRequest } from '../welcomepage/welcomepage.component';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  constructor(public settings: SettingsService,
    public rcApi: RcapiService) { }
  goHome() {
    this.rcApi.RequestArray;
  }
}
