export interface ITicketProps {
    ticketId: number;
    ticketName: string;
    ticketDescription: string;
    ticketCreationDate: Date;
    ticketClosingDate?: Date;
    creatorId: string;
    priorityId: number;
    statusId: number;
    statusLibelle?: string;
}

export class TicketModel implements ITicketProps {

    creatorId: string;
    priorityId: number;
    statusId: number;
    ticketClosingDate?: Date;
    ticketCreationDate: Date;
    ticketDescription: string;
    ticketId: number;
    ticketName: string;
    statusLibelle?: string;

    constructor(properties: ITicketProps) {
        this.ticketId = properties.ticketId;
        this.ticketName = properties.ticketName;
        this.ticketDescription = properties.ticketDescription;
        this.ticketCreationDate = properties.ticketCreationDate;
        this.ticketClosingDate = properties.ticketClosingDate;
        this.statusId = properties.statusId;
        this.priorityId = properties.priorityId;
        this.creatorId = properties.creatorId;
        this.statusLibelle = properties.statusLibelle;
    }
}
