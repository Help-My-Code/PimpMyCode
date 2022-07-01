import {Component, Input, OnInit} from '@angular/core';
import {CommentService} from "../../services/comment.service";
import {MessageService} from "primeng/api";
import {Comment} from "../../models/comment.model";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {Room} from "../../models/room";

@Component({
    selector: 'app-comment-display',
    templateUrl: './comment-display.component.html',
    styleUrls: ['./comment-display.component.css']
})
export class CommentDisplayComponent implements OnInit {

    displayComments: boolean;

    comments: Comment[];

    @Input() room: Room;

    updatedContentId = "";

    constructor(private commentService: CommentService,
                private messageService: MessageService) {
    }

    ngOnInit(): void {
    }

    private initComments() {
        this.commentService.getCommentsOfRoom(this.room.id)
            .pipe(catchError(err => {
                if (err.status) {
                    this.toastError();
                    console.log(err.statusText);
                }
                return throwError(err);
            }))
            .subscribe((result) => {
                const returnedData: any = result;
                const jsondata = JSON.parse(returnedData._body);
                if (jsondata.comments) {
                    this.comments = jsondata.comments
                } else {
                    this.toastError();
                    console.log(returnedData.statusText);
                }
            });
    }

    showAddCommentDialog() {
        this.displayComments = true;
        this.initComments();
    }

    displayUpdateComment(comment: Comment) {
        this.updatedContentId = comment.id;
    }

    updateComment(comment: Comment) {
        this.commentService.updateComment(comment.id, comment.content)
            .pipe(catchError(err => {
                if (err.status) {
                    this.toastError();
                    console.log(err.statusText);
                }
                return throwError(err);
            }))
            .subscribe((result) => {
                const returnedData: any = result;
                if (returnedData.status === 200) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Comment updated',
                        detail: 'The comment has been updated'
                    });
                    this.updatedContentId = "";
                } else {
                    this.toastError();
                    console.log(returnedData.statusText);
                }
            });
    }

    deleteComment(comment: Comment) {
        this.commentService.deleteComment(comment.id)
            .pipe(catchError(err => {
                if (err.status) {
                    this.toastError();
                    console.log(err.statusText);
                }
                return throwError(err);
            }))
            .subscribe((result) => {
                const returnedData: any = result;
                if (returnedData.status === 200) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Comment deleted',
                        detail: 'The comment has been deleted'
                    });
                    this.displayComments = false;
                } else {
                    this.toastError();
                    console.log(returnedData.statusText);
                }
            });
    }

    private toastError() {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error has occurred'
        });
    }
}
