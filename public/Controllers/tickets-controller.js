'use strict';

import { loadTemplate } from 'templates';
import { TicketsModel } from 'ticketsModel';

class TicketsController {
    constructor() {
        this._container = $('#container');
        this._homeModel = new TicketsModel;
    }

    get container() {
        return this._container;
    }

    get homeModel() {
        return this._homeModel;
    }

    loadTemplate() {
        let self = this;
        let tickets = this.homeModel.getTickets();

        console.log(tickets.progress);
        let lodaTemplate = new loadTemplate('tickets');
        lodaTemplate.getTemplate()
            .then(template => {
                this.container.html(template(tickets));
                this.draggable();
            });
    }

    draggable() {
        $('.dropConnect').disableSelection();

        $('#draggable-todo').sortable({
            revert: 'invalid',
            connectWith: ".dropConnect",
            items: "div.drag-container"
        });

        $('#draggable-done').sortable({
            revert: 'invalid',
            connectWith: ".dropConnect",
            items: "div.drag-container"
        });

        $('#draggable-progress').sortable({
            revert: 'invalid',
            connectWith: ".dropConnect",
            items: "div.drag-container"
        });
    }
}

export { TicketsController };