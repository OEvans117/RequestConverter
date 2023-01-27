import { Component } from '@angular/core';
import { CodeService } from '../../services/code/code.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'preferencesmodal',
  templateUrl: './preferencesmodal.component.html',
  styleUrls: ['./preferencesmodal.component.css']
})
export class PreferencesmodalComponent {
  constructor(public codeService: CodeService, public settings: SettingsService) { }

  closeModal() {
    this.settings.LaunchPreferences = false;
  }
}
