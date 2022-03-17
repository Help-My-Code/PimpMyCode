import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {getCurrentTokenWithoutQuotes} from "../../Utils/TokenUtils";
import {UserType} from "../../../enum/user-type";

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
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
            'email': ['', [Validators.email, Validators.required]],
            'password': ['', Validators.required],
        });
    }

    login() {
        this.message = "";
        this.loading = "chargement...";
        const credentials = this.loginForm.value;
        this.userService.login(credentials)
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
                } else if (jsondata.token) {
                    localStorage.setItem('currentToken', JSON.stringify(jsondata.token));
                    this.redirectUserToApplication();
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

    forgotPasswordCall() {
        this.router.navigate(['forgot-password'])
    }

    ngOnInit() {
        if (localStorage.getItem('currentToken')) {
            this.redirectUserToApplication();
        }
    }
}
