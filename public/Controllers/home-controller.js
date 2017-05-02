'use strict';

import { loadTemplate } from 'templates';
import { HomeModel } from 'homeModel';

class HomeController {
    constructor() {
        this._container = $('#container'),
            this._homeModel = new HomeModel;
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
        console.log(tickets)
        let lodaTemplate = new loadTemplate('home');
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

export { HomeController };