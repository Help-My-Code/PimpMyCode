import {Component, OnInit} from '@angular/core';
import {Comment} from "../../models/comment.model";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
    selector: 'app-comment-list',
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

    comments: Comment[] = [
        new Comment({
            commentId: 1,
            content: "C'est bien il n'y a pas de boucle infinie",
            codeLinked: "for(int i = 0 ; i < 10 ; i += 1) {\n" +
                "      print(i);\n" +
                "    }",
            creatorId: "1"
        }),
        new Comment({
            commentId: 2,
            content: "ça marche sur plus ?",
            codeLinked: "for(int i = 0 ; i < 10 ; i += 1)",
            creatorId: "2"
        })
    ];

    constructor(
        //private commentService: CommentService,
        public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    }

    ngOnInit() {
        //TODO récupérer les commentaires existants
        //this.commentService.getCommentsSmall().then(comments => this.comments = comments);
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
