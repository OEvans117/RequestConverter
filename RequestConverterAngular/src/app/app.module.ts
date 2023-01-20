import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MainpageComponent } from './components/mainpage/mainpage.component';
import { MenuComponent } from './components/menu/menu.component';
import { WelcomepageComponent } from './components/welcomepage/welcomepage.component';
import { RequestpageComponent } from './components/requestpage/requestpage.component';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    MainpageComponent,
    MenuComponent,
    WelcomepageComponent,
    RequestpageComponent,
  ],
  imports: [
    CodemirrorModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
