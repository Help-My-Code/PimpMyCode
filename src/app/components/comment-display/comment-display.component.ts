import {Component, Input, OnInit} from '@angular/core';
import {CommentService} from "../../services/comment.service";
import {MessageService} from "primeng/api";
import {Comment} from "../../models/comment.model";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {RoomService} from "../../services/room.service";

@Component({
  selector: 'app-comment-display',
  templateUrl: './comment-display.component.html',
  styleUrls: ['./comment-display.component.css']
})
export class CommentDisplayComponent implements OnInit {

  displayComments: boolean;

  comments: Comment[];
  message = "";
  loading = "";

  private contentId: any;

  @Input() roomId;

  constructor(private commentService: CommentService,
              private roomService: RoomService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
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

  showAddCommentDialog() {
      this.displayComments = true;
  }

  updateComment(comment: Comment) {
    //TODO
  }

  deleteComment(comment: Comment) {
    //TODO
  }
}
