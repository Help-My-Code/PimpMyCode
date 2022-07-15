import { Ace } from "ace-builds";

export interface User {
  user_id: string;
}

export enum CompilationState {
  START = "START",
  END = "END",
}

export class ChatMessage {
  user: User;
  content: string;
  room_id: string;
}

export class CodeUpdateOutput {
  user: User;
  content: Ace.Delta[];
}

export class CompilationEvent {
  state: string;
  stdout: string;
}
