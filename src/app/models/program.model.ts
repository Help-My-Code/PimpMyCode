export interface IProgram {
    id: string;
    stdin: string;
    stdout: string;
    createdAt: Date;
}

export class Program implements IProgram {

    id: string;
    stdin: string;
    stdout: string;
    createdAt: Date;

    constructor(properties: IProgram) {
        this.id = properties.id;
        this.stdin = properties.stdin;
        this.stdout = properties.stdout;
        this.createdAt = properties.createdAt;
    }
}
