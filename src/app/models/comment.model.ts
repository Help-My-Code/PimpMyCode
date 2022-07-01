export interface IComment {
    commentId: number;
    content: string;
    codeLinked: string;
    creatorId: string;
    roomId: string;
}

export class Comment implements IComment {

    commentId: number;
    content: string;
    codeLinked: string;
    creatorId: string;
    roomId: string;

    constructor(properties: IComment) {
        this.commentId = properties.commentId;
        this.content = properties.content;
        this.codeLinked = properties.codeLinked;
        this.creatorId = properties.creatorId;
        this.roomId = properties.roomId;
    }
}
