import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Http} from "@angular/http";
import {environment} from '../../environments/environment';

export const BASIC_USER_TYPE_ID = 3;

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    private readonly BASE_URL = '/comment';

    constructor(private http: Http) {
    }

    getCommentsOfRoom(roomId: string) {
        return this.http.get(environment.URL + this.BASE_URL + "/getByRoom", {
            params: {
                roomId: roomId
            }
        });
    }

    addComment(content: string, codeLinked: string, creatorId: string, roomId: string) {
        return this.http.post(environment.URL + this.BASE_URL + "/create", {
            content: content,
            codeLinked: codeLinked,
            creatorId: creatorId,
            roomId: roomId
        });
    }

    updateComment(commentId: string, content: string) {
        return this.http.put(environment.URL + this.BASE_URL + "/update", {
            content: content,
            commentId: commentId
        });
    }

    deleteComment(commentId: string) {
        return this.http.delete(environment.URL + this.BASE_URL + "/delete", {
            body: {
                commentId: commentId
            }
        });
    }

}
