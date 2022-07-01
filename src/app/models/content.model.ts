import {ContentType} from "./enums/content-type";

export interface IContent {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    contentType: ContentType;
}

export class Content implements IContent {

    id: string;
    title: string;
    content: string;
    createdAt: Date;
    contentType: ContentType;

    constructor(properties: IContent) {
        this.id = properties.id;
        this.content = properties.content;
        this.title = properties.title;
        this.createdAt = properties.createdAt;
        this.contentType = properties.contentType;
    }
}
