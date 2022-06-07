import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {AuthenticationComponent} from './components/authentication/authentication.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {RegisterComponent} from './components/register/register.component';
import {NgxLoadingModule} from 'ngx-loading';
import {NgModule} from "@angular/core";
import {ButtonModule} from "primeng/button";
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {LogoutComponent} from './components/logout/logout.component';
import {ContactSupportComponent} from './components/contact-support/contact-support.component';
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {AutoCompleteModule} from "primeng/autocomplete";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { LiveCodingComponent } from './components/live-coding/live-coding.component';
import {DropdownModule} from "primeng/dropdown";
import {RippleModule} from "primeng/ripple";

@NgModule({
    declarations: [
        AppComponent,
        AuthenticationComponent,
        HeaderComponent,
        FooterComponent,
        RegisterComponent,
        ForgotPasswordComponent,
        LogoutComponent,
        ContactSupportComponent,
        LiveCodingComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        HttpModule,
        ReactiveFormsModule,
        NgxLoadingModule.forRoot({}),
        ButtonModule,
        ToastModule,
        AutoCompleteModule,
        DropdownModule,
        FormsModule,
        RippleModule
    ],
    providers: [
        HttpClient,
        MessageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
