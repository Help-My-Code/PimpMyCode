import {Injectable} from '@angular/core';
import {config} from '../../config/pimpmycode.config';
import {User} from '../models/user';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Http} from "@angular/http";

export const BASIC_USER_TYPE_ID = 3;

@Injectable({
    providedIn: 'root'
})
export class RoomService {

    private readonly BASE_URL = '/room';

    constructor(private http: Http) {
    }

    getByContentId(contentId: string) {
        return this.http.get(config.URL + this.BASE_URL + "/getByContentId", {
            params: {
                contentId: contentId
            }
        });
    }

}
