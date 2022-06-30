import {Component, Input, OnInit} from '@angular/core';
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {MessageService} from "primeng/api";
import {CommentService} from "../../services/comment.service";

@Component({
    selector: 'app-comment-creation',
    templateUrl: './comment-creation.component.html',
    styleUrls: ['./comment-creation.component.css']
})
export class CommentCreationComponent implements OnInit {

    displayAddComment: boolean;

    comment: string = "";

    @Input() code = '';
    @Input() userId;
    @Input() roomId;

    constructor(private commentService: CommentService,
                private messageService: MessageService) {
    }

    ngOnInit(): void {
    }

    showAddCommentDialog() {
        if (this.code.trim() === "") {
            this.messageService.add({
                severity: 'warn',
                summary: 'Impossible to add a comment',
                detail: 'Please select some code to add a comment'
            });
        } else {
            this.displayAddComment = true;
        }
    }

    addComment() {
        if (this.comment.trim() === "") {
            this.messageService.add({
                severity: 'warn',
                summary: 'Impossible to add a comment',
                detail: 'Please add a comment in the field'
            });
        } else {
            this.commentService.addComment(this.comment, this.code, this.userId, this.roomId)
                .pipe(catchError(err => {
                    if (err.status) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'An error has occurred'
                        });
                        console.log(err.statusText);
                    }
                    return throwError(err);
                }))
                .subscribe((result) => {
                    const returnedData: any = result;
                    if (returnedData.status === 201) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Comment published',
                            detail: 'The comment is published'
                        });
                        this.displayAddComment = false;
                        this.comment = "";
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'An error has occurred'
                        });
                        console.log(returnedData.statusText);
                    }
                });
        }
    }

}
