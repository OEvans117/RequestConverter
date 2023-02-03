import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { RcapiService } from '../../services/api/rcapi.service';

@Component({
  selector: 'topmenu',
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.css']
})
export class TopmenuComponent {
  constructor(public settings: SettingsService,
    public rcApi: RcapiService,
    private rcSettings: SettingsService) { }
    goHome() {
      //this.rcSettings.RequestArray;
    }
}
