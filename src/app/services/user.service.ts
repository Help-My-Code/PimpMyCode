import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Http} from "@angular/http";
import {environment} from '../../environments/environment';

export const BASIC_USER_TYPE_ID = 3;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: Http, private httpClient: HttpClient) {
    }

    login(userModel: User) {
        return this.http.post(environment.URL + "/auth/login", {
            mail: userModel.email,
            password: userModel.password
        });
    }

    register(data: User) {
        return this.http.post(environment.URL + "/auth/subscribe", {
            mail: data.email,
            password: data.password,
            name: data.fullName,
            firstname: data.firstName,
            typeId: BASIC_USER_TYPE_ID
        })
    }

    getUserByMail(data: User) {
        return this.http.get(environment.URL + "/auth/forgot-password", {
            params: {
                mail: data.email
            }
        });
    }

    getUserByToken(token: string) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.httpClient.get(environment.URL + `/user/getUserByToken/${token}`, {
            headers: headers
        });
    }

}
