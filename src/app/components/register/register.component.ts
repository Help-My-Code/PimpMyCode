import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {UserModel} from '../../models/user.model';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {getCurrentTokenWithoutQuotes} from "../../Utils/TokenUtils";
import {UserType} from "../../../enum/user-type";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  passwordMatched: boolean = false;
  userModel = new UserModel();
  returnedData: any;
  message: any;
  loading = "";

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      'fullName': ['', Validators.required],
      'firstName': ['', Validators.required],
      'password': ['', [Validators.pattern('^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,}$'), Validators.required]],
      'confirmPassword': ['', Validators.required],
      'email': ['', [Validators.email, Validators.required]],
    });
  }

  register() {
    this.message = "";
    this.loading = "chargement...";
    const data = this.registerForm.value;
    this.userService.register(data)
      .pipe(catchError(err => {
        if (err.status) {
          this.loading = "";
          this.message = err.statusText;
        }
        return throwError(err);
      }))
      .subscribe(res => {
        this.loading = "";
        this.returnedData = res;
        let jsondata = JSON.parse(this.returnedData._body);
        if (!this.returnedData.ok) {
          this.message = this.returnedData.statusText;
          return;
        } else if (jsondata.session && jsondata.session.token) {
          localStorage.setItem('currentToken', JSON.stringify(jsondata.session.token));
          this.redirectUserToApplication();
        } else {
          this.message = "An error was occured";
        }
      })
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

  checkPasswordMatch(password) {
    this.passwordMatched = password == this.userModel.confirmPassword;
  }

  checkConfirmPasswordMatch(confirmedPassword) {
    this.passwordMatched = confirmedPassword == this.userModel.password;
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
