import { Injectable } from '@angular/core';
import {TicketModel} from "../models/ticket.model";
import {Priority} from "../enums/priority";
import {HttpService} from "./http.service";
import {config} from "../../config/pimpmycode.config";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private httpService: HttpService) { }

  async createTicket(ticket: TicketModel): Promise<TicketModel> {
    let priority: Priority;
    if(ticket['priority'] as unknown as string === 'Faible') {
      priority = Priority.Low;
    }
    else if (ticket['priority'] as unknown as string === 'Elevé') {
      priority = Priority.High;
    }
    else {
      priority = Priority.Medium;
    }
    return (await this.httpService.post<TicketModel>(config.URL + "/ticket/add", {
      description: ticket['description'],
      name: ticket['name'],
      priorityId: priority,
      creator: ticket['email']
    }));
  }
}
