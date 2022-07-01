import {Content} from "./content.model";
import {Program} from "./program.model";

export class IRoom {
  id: string;
  content: Content;
  program: Program;
}

export class Room implements IRoom {
  id: string;
  content: Content;
  program: Program;

  constructor(properties: IRoom) {
    this.id = properties.id;
    this.content = properties.content;
    this.program = properties.program;
  }
}
