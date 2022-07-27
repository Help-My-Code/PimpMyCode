import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "./components/header/header.component";
import { NgxLoadingModule } from "ngx-loading";
import { NgModule } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { AutoCompleteModule } from "primeng/autocomplete";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LiveCodingComponent } from "./components/live-coding/live-coding.component";
import { DropdownModule } from "primeng/dropdown";
import { RippleModule } from "primeng/ripple";
import { InputTextareaModule } from "primeng/inputtextarea";
import { TableModule } from "primeng/table";
import { DialogService } from "primeng/dynamicdialog";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { CommentCreationComponent } from "./components/comment-creation/comment-creation.component";
import { DialogModule } from "primeng/dialog";
import { CommentDisplayComponent } from "./components/comment-display/comment-display.component";
import { MessageBoxComponent } from "./components/message-box/message-box.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LiveCodingComponent,
    CommentCreationComponent,
    CommentDisplayComponent,
    MessageBoxComponent,
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
    RippleModule,
    InputTextareaModule,
    TableModule,
    ProgressSpinnerModule,
    DialogModule,
  ],
  providers: [HttpClient, MessageService, DialogService],
  bootstrap: [AppComponent],
})
export class AppModule {}
