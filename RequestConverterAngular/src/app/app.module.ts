import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TopmenuComponent } from './components/topmenu/topmenu.component';
import { WelcomepageComponent } from './components/welcomepage/welcomepage.component';
import { RequestpageComponent } from './components/requestpage/requestpage.component';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CodesettingsComponent } from './components/codesettings/codesettings.component';
import { PreferencesmodalComponent } from './components/preferencesmodal/preferencesmodal.component';

import { NgxJsonViewerModule } from 'ngx-json-viewer';

@NgModule({
  declarations: [
    AppComponent,
    TopmenuComponent,
    WelcomepageComponent,
    RequestpageComponent,
    CodesettingsComponent,
    PreferencesmodalComponent,
  ],
  imports: [
    CodemirrorModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgxJsonViewerModule,
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
