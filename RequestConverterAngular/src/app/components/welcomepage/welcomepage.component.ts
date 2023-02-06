import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, isDevMode } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { RcapiService } from '../../services/api/rcapi.service';

@Component({
  selector: 'welcomepage',
  templateUrl: './welcomepage.component.html',
  styleUrls: ['./welcomepage.component.css']
})
export class WelcomepageComponent {

  constructor(public rcApi: RcapiService) { }

  onFileSelected(event: any) {

    const RequestFile: File = event.target.files[0];

    if (RequestFile)
      this.rcApi.ConvertFile(RequestFile);
  }

  private exampleBundle: string;


  visitExample() {

    if (isDevMode())
      this.exampleBundle = "fjb829"
    else
      this.exampleBundle = "hklyhi";

    location.href = window.location.href + "r/" + this.exampleBundle;
  }

  visitUrl(value: string) {
    location.href = value;
  }
}
