import {Injectable} from '@angular/core';
import {config} from '../../config/pimpmycode.config';
import {User} from '../models/user';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Http} from "@angular/http";

export const BASIC_USER_TYPE_ID = 3;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: Http, private httpClient: HttpClient) {
    }

    login(userModel: User) {
        return this.http.post(config.URL + "/auth/login", {
            mail: userModel.email,
            password: userModel.password
        });
    }

    register(data: User) {
        return this.http.post(config.URL + "/auth/subscribe", {
            mail: data.email,
            password: data.password,
            name: data.fullName,
            firstname: data.firstName,
            typeId: BASIC_USER_TYPE_ID
        })
    }

    getUserByMail(data: User) {
        return this.http.get(config.URL + "/auth/forgot-password", {
            params: {
                mail: data.email
            }
        });
    }

    getUserByToken(token: string) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.httpClient.get(config.URL + `/user/getUserByToken/${token}`, {
            headers: headers
        });
    }

}
