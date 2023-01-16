import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UploadpageComponent } from './uploadpage/uploadpage.component';
import { MenuComponent } from './menu/menu.component';
import { WelcomeModalComponent } from './welcome-modal/welcome-modal.component';
import { RequestpageComponent } from './requestpage/requestpage.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { PythonPipe } from './pipes/python.pipe';

@NgModule({
  declarations: [
    AppComponent,
    UploadpageComponent,
    MenuComponent,
    WelcomeModalComponent,
    RequestpageComponent,
    PythonPipe,
  ],
  imports: [
    CodemirrorModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
