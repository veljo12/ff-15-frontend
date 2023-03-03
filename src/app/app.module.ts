import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { GeneralModule } from './components/general/general.module';
import { ToastrModule } from 'ngx-toastr';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [AppComponent, HomeComponent, ContactComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        GeneralModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({ positionClass: 'toast-top-center' }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
