import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {environment} from '../../environments/environment';

export const BASIC_USER_TYPE_ID = 3;

@Injectable({
    providedIn: 'root'
})
export class RoomService {

    private readonly BASE_URL = '/room';

    constructor(private http: Http) {
    }

    getByContentId(contentId: string) {
        return this.http.get(environment.URL + this.BASE_URL + "/getByContentId", {
            params: {
                contentId: contentId
            }
        });
    }

}
