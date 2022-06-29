import {Component, OnInit} from '@angular/core';
import {Comment} from "../../models/comment.model";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {CommentService} from "../../services/comment.service";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {RoomService} from "../../services/room.service";

@Component({
    selector: 'app-comment-list',
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

    roomId = "";
    private contentId: any;

    comments: Comment[];
    message = "";
    loading = "";

    constructor(
        private commentService: CommentService,
        private roomService: RoomService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig) {
    }

    ngOnInit() {
        this.initRoomId();
    }

    private initRoomId() {
        const urlParams = new URLSearchParams(window.location.search);
        this.contentId = urlParams.get('content');
        this.roomService.getByContentId(this.contentId)
            .pipe(catchError(err => {
                if (err.status) {
                    this.loading = "";
                    this.message = err.statusText;
                }
                return throwError(err);
            }))
            .subscribe((result) => {
                this.loading = "";
                const returnedData: any = result;
                const jsondata = JSON.parse(returnedData._body);
                if (!returnedData.ok) {
                    this.message = returnedData.statusText;
                    return;
                } else if (jsondata.room) {
                    this.roomId = jsondata.room.id
                    this.initComments();
                } else {
                    this.message = "An error has occurred";
                }
            });
    }

    private initComments() {
        this.message = "";
        this.loading = "Charging...";
        this.commentService.getCommentsOfRoom(this.roomId)
            .pipe(catchError(err => {
                if (err.status) {
                    this.loading = "";
                    this.message = err.statusText;
                }
                return throwError(err);
            }))
            .subscribe((result) => {
                this.loading = "";
                const returnedData: any = result;
                const jsondata = JSON.parse(returnedData._body);
                if (!returnedData.ok) {
                    this.message = returnedData.statusText;
                    return;
                } else if (jsondata.comments) {
                    this.comments = jsondata.comments
                } else {
                    this.message = "An error has occurred";
                }
            });
    }

    updateComment(comment: Comment) {
        //TODO
        this.ref.close(comment);
    }

    deleteComment(comment: Comment) {
        //TODO
        this.ref.close(comment);
    }
}
