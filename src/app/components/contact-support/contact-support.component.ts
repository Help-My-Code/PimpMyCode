import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {UserService} from "../../services/user.service";
import {UserModel} from "../../models/user.model";
import {MessageService} from "primeng/api";
import {TicketService} from "../../services/ticket.service";

@Component({
    selector: 'app-contact-support',
    templateUrl: './contact-support.component.html',
    styleUrls: ['./contact-support.component.css']
})
export class ContactSupportComponent implements OnInit {

    creatorMail: string = "";

    registerForm: FormGroup;

    returnedData: any;
    message: any;
    loading = "";
    userModel = new UserModel();

    filteredItems: any[];
    priorityLevelItems: any[] = ['Faible', 'Moyen', 'Elevé'];

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private ticketService: TicketService
    ) {
        this.registerForm = this.formBuilder.group({
            'name': ['', Validators.required],
            'description': ['', Validators.required],
            'priority': ['', Validators.required],
            'email': ['', [Validators.email]]
        });
    }

    ngOnInit(): void {
        this.getCreatorMail();
    }

    getCreatorMail() {
        this.route.queryParams.subscribe(params => {
            this.creatorMail = params['creator'];
        });
    }

    async contactSupport() {
        this.loading = "chargement...";
        await this.ticketService.createTicket(this.registerForm.value);
        this.loading = "";
        this.messageService.add({severity: 'success', summary: 'Envoyé', detail: 'Votre ticket a bien été envoyé au support'});
    }

    filterItems(event) {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < this.priorityLevelItems.length; i++) {
            let item = this.priorityLevelItems[i];
            if (item.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(item);
            }
        }

        this.filteredItems = filtered;
    }

}
