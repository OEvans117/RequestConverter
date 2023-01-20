import { Component, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { CodeFormatter, CodeService } from '../../services/code.service';
import { CSharpHttpWebRequestFormatter } from '../../services/languages/csharp/httpwebrequest';
import { PythonRequestsFormatter } from '../../services/languages/python/requests';
import { RcapiService } from '../../services/rcapi.service';
import { RouterModule, Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Validators } from '@angular/forms';

@Component({
  selector: 'mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css'],
  providers: [RcapiService, CodeService,
    { provide: CodeFormatter, useClass: PythonRequestsFormatter, multi: true },
    { provide: CodeFormatter, useClass: CSharpHttpWebRequestFormatter, multi: true },
  ],
})

export class MainpageComponent {
  constructor(public rcApi: RcapiService, private route: ActivatedRoute, private location: Location) {
    const regex = /\/r\/(\b\w{6,6})\b/gm;
    console.log(this.route.snapshot.paramMap.get('id'));

  }
}
