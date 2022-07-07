import {User} from "./user";
import {Room} from "./room";

export interface IComment {
    id: string;
    content: string;
    code_linked: string;
    creator: User;
    room: Room;
}

export class Comment implements IComment {

    id: string;
    content: string;
    code_linked: string;
    creator: User;
    room: Room;

    constructor(properties: IComment) {
        this.id = properties.id;
        this.content = properties.content;
        this.code_linked = properties.code_linked;
        this.creator = properties.creator;
        this.room = properties.room;
    }
}
