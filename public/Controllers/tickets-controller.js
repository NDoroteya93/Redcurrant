'use strict';

import { loadTemplate } from 'templates';
import { TicketsModel } from 'ticketsModel';
import { Helpers } from 'helpers';

const LOCAL_STORAGE_USERNAME_KEY = 'signed-in-user-username',
    LOCAL_STORAGE_AUTHKEY_KEY = 'signed-in-user-auth-key';

class TicketsController {
    constructor() {
        this._container = $('#container');
        this._ticketModel = new TicketsModel;
        this._helpers = new Helpers;
    }

    get container() {
        return this._container;
    }

    get ticketsModel() {
        return this._ticketModel;
    }

    get helpers() {
        return this._helpers;
    }

    loadTemplate() {
        let self = this,
            tickets;

        let lodaTemplate = new loadTemplate('tickets');
        lodaTemplate.getTemplate()
            .then((template) => {
                tickets = this.ticketsModel.getTickets();
                return template;
            })
            .then(template => {
                setTimeout(function() {
                    self.container.html(template(tickets));
                    self.initEvents();
                }, 500)
            });
    }

    initEvents() {

        let self = this;
        // edit button 
        $('.edit-ticket').on('click', function() {
            let $this = $(this),
                $parent = $this.parents('.drag-container'),
                $id = $parent.data('id');
            self.loadDetailsTemplate($id);
        });


        // dragable tickets
        this.draggable();

        // add ticket event
        $('#addTicketBtn').on('click', function() {
            let $title = $('#ticket-title').val(),
                $description = $('#ticket-description').val(),
                $priority = $("#select-priority option:selected").data('priority');
            self.ticketsModel.addTicket($title, $description, $priority);
            $("#editТicket").modal('hide');
        })
    }

    draggable() {
        let position_updated = false, //flag bit
            self = this;
        // TODO
        $('.dropConnect').disableSelection();

        $('#draggable-todo').sortable({
            revert: 'invalid',
            connectWith: ".dropConnect",
            items: "div.drag-container",
            update: function(event, ui) {

                // get id and states
                const element = ui.item[0],
                    $id = $(element).data('id'),
                    $state = $(element).data('state'),
                    $parent = $(element).parents('.nopadding').data('state');

                // update
                if ($state !== $parent) {
                    $(element).attr('data-state', $parent);
                    self.updateState($id, $parent);
                }
                position_updated = !ui.sender; //if no sender, set sortWithin flag to true
            },
            stop: function(event, ui) {
                if (position_updated) {
                    //code
                    position_updated = false;
                }
            }
        });

        // Done
        $('#draggable-done').sortable({
            revert: 'invalid',
            connectWith: ".dropConnect",
            items: "div.drag-container",
            update: function(event, ui) {
                const element = ui.item[0],
                    $id = $(element).data('id'),
                    $state = $(element).data('state'),
                    $parent = $(element).parents('.nopadding').data('state');

                // update
                if ($state !== $parent) {
                    $(element).attr('data-state', $parent);
                    self.updateState($id, $parent);
                }

                position_updated = !ui.sender;
            },
            stop: function(event, ui) {
                if (position_updated) {
                    //code
                    position_updated = false;
                }
            },
            receive: function(event, ui) {
                // code
            }
        });
        // Progress
        $('#draggable-progress').sortable({
            revert: 'invalid',
            connectWith: ".dropConnect",
            items: "div.drag-container",
            update: function(event, ui) {
                const element = ui.item[0],
                    $id = $(element).data('id'),
                    $state = $(element).data('state'),
                    $parent = $(element).parents('.nopadding').data('state');

                // update
                if ($state !== $parent) {
                    $(element).attr('data-state', $parent);

                    self.updateState($id, $parent);
                }
                position_updated = !ui.sender;
            },
            stop: function(event, ui) {
                if (position_updated) {
                    //code
                    position_updated = false;
                }
            },
            receive: function(event, ui) {
                // code
            }
        });
    }

    updateState(id, state) {
        const body = {
            taskState: state
        }
        this.ticketsModel.changeState(id, state, body);
    }

    // get tickets details
    loadDetailsTemplate(id) {
        let self = this,
            details;

        let template = new loadTemplate('tickets-details');
        template.getTemplate()
            .then((res) => {
                details = this.ticketsModel.getTicketsDetails(id);
                console.log(details);
                return res;
            })
            .then(res => {
                setTimeout(function() {
                    self.container.html(res(details));
                }, 1000)
            });
    }

    // add ticket
    addTicket() {
        debugger;
        let addTemplate = new loadTemplate('tickets-add'),
            self = this;
        addTemplate.getTemplate()
            .then((template) => {
                $('<div id="popupAdd"></div>').appendTo(self.container);
                $('#popupAdd').html(template());
                $("#editТicket").modal('show');
                self.initEvents();
            });
    }

    allTickets() {
        debugger;
        let self = this,
            tickets;

        this.helpers.priorityHelper();

        let lodaTemplate = new loadTemplate('tickets-all');
        lodaTemplate.getTemplate()
            .then((template) => {
                tickets = this.ticketsModel.getTickets();
                console.log(tickets);
                return template;
            })
            .then(template => {
                setTimeout(function() {
                    self.container.html(template(tickets));
                }, 500);
            });
    }
}


export { TicketsController };