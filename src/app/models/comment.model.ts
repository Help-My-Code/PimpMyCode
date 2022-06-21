export interface IComment {
    commentId: number;
    content: string;
    codeLinked: string;
    creatorId: string;
}

export class Comment implements IComment {

    commentId: number;
    content: string;
    codeLinked: string;
    creatorId: string;

    constructor(properties: IComment) {
        this.commentId = properties.commentId;
        this.content = properties.content;
        this.codeLinked = properties.codeLinked;
        this.creatorId = properties.creatorId;
    }
}
