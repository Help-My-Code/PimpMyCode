import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Http} from "@angular/http";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {getCurrentTokenWithoutQuotes} from "../../Utils/TokenUtils";
import {UserType} from "../../../enum/user-type";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  loginForm: FormGroup;
  returnedData: any;
  message: any;
  loading = "";

  constructor(
    private http: Http,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      'email': ['', [Validators.email, Validators.required]]
    });
  }

  resetPassword() {
    this.message = "";
    this.loading = "chargement...";
    const credentials = this.loginForm.value;
    this.userService.getUserByMail(credentials)
      .pipe(catchError(err => {
        if (err.status) {
          this.loading = "";
          this.message = err.statusText;
        }
        return throwError(err);
      }))
      .subscribe((result) => {
        this.loading = "";
        this.returnedData = result;
        const jsondata = JSON.parse(this.returnedData._body);
        if (!this.returnedData.ok) {
          this.message = this.returnedData.statusText;
          return;
        } else if (jsondata.mail) {
          this.message = "La fonction de réinitialisation de mot de passe n'est pas encore disponible"
          /*localStorage.setItem('currentToken', JSON.stringify(jsondata.token));
          this.router.navigate(['dashboard']);*/
        } else {
          this.message = "An error was occured";
        }
      });
  }

  redirectUserToApplication() {
    this.userService.getUserByToken(getCurrentTokenWithoutQuotes())
        .pipe(catchError(err => {
          if (err.status) {
            this.loading = "";
            this.message = err.statusText;
          }
          return throwError(err);
        })).subscribe((result) => {
      const returnedData: any = result;
      if (!returnedData.typeId) {
        this.message = this.returnedData.statusText;
        return;
      } else if (returnedData.typeId) {
        const userType = returnedData.typeId;
        if(userType === UserType.Developer || userType === UserType.Adminisator || userType === UserType.SuperAdministrator) {
          window.location.href = `http://localhost:4201?token=${getCurrentTokenWithoutQuotes()}`;
        }
        else {
          window.location.href = `http://localhost:4202?token=${getCurrentTokenWithoutQuotes()}`;
        }
      } else {
        this.message = "An error was occured";
      }
    });
  }

  registerCall() {
    this.router.navigate(['register'])
  }

  loginCall() {
    this.router.navigate([''])
  }

  ngOnInit() {
    if (localStorage.getItem('currentToken')) {
      this.redirectUserToApplication();
    }
  }
}
