import {Injectable} from '@angular/core';
import {config} from '../../config/pimpmycode.config';
import {UserModel} from '../models/user.model';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Http} from "@angular/http";

export const BASIC_USER_TYPE_ID = 3;

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    private readonly BASE_URL = '/comment';

    constructor(private http: Http) {
    }

    getCommentsOfRoom(roomId: string) {
        return this.http.get(config.URL + this.BASE_URL + "/getByRoom", {
            params: {
                roomId: roomId
            }
        });
    }

    addComment(content: string, codeLinked: string, creatorId: string, roomId: string) {
        return this.http.post(config.URL + this.BASE_URL + "/create", {
            content: content,
            codeLinked: codeLinked,
            creatorId: creatorId,
            roomId: roomId
        });
    }

}
