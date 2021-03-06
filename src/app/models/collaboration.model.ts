export interface Delta {
    start: Point;
    end: Point;
    action: 'insert' | 'remove';
    lines: Array<string>;
    timestamp: string;
}

export interface Point {
    row: number;
    column: number;
}

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
  content: Delta[];
}

export class CompilationEvent {
  state: string;
  stdout: string;
}
