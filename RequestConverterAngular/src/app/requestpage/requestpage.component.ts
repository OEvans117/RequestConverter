import { HttpClient } from '@angular/common/http';
import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { SRequest } from '../welcome-modal/welcome-modal.component';

@Component({
  selector: 'requestpage',
  templateUrl: './requestpage.component.html',
  styleUrls: ['./requestpage.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class RequestpageComponent {
  @Input() jsonResp: SRequest[];
  currentRequest:any;

  @ViewChild(CodemirrorComponent) codemirrorComponent: CodemirrorComponent | undefined;

  constructor() {
    this.codemirrorComponent?.codeMirror?.setSize(null, 100);
  }

  onOptionsSelected(value: any) {
    console.log(value);
  }

  onSelected(value: string): void {
    console.log(value);
    let obj = this.jsonResp.find((j: { url: string; }) => j.url === value);
    this.currentRequest = obj;
    console.log("done");
  }

  codeMirrorOptions: any = {
    mode: 'python',
    autoRefresh: true,
    styleActiveLine: true,
    lineNumbers: true,
    lineWrapping: true,
    autoCloseTags: true,
    foldGutter: true,
    dragDrop: true,
    lint: true,
    theme: 'nord'
  };
}
