import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { RcapiService } from '../../services/api/rcapi.service';
import { SRequest } from '../welcomepage/welcomepage.component';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  constructor(public settings: SettingsService,
    public rcApi: RcapiService,
    private rcSettings: SettingsService) { }
    goHome() {
      this.rcSettings.RequestArray;
    }

}
