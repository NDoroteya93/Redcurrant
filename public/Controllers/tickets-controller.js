'use strict';

import { loadTemplate } from 'templates';
import { TicketsModel } from 'ticketsModel';
import { UserModel } from 'userModel';
import { CategoryModel } from 'categoryModel';
import { Helpers } from 'helpers';

const LOCAL_STORAGE_USERNAME_KEY = 'signed-in-user-username',
    LOCAL_STORAGE_AUTHKEY_KEY = 'signed-in-user-auth-key';

class TicketsController {
    constructor() {
        this._container = $('#container');
        this._ticketModel = new TicketsModel;
        this._users = new UserModel;
        this._categories = new CategoryModel;
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

    get users() {
        return this._users;
    }

    get categories() {
        return this._categories;
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
                $priority = $("#select-priority option:selected").data('priority'),
                $category = $("#select-category option:selected").data('id');
            self.ticketsModel.addTicket($title, $description, $priority, $category);
            $("#editТicket").modal('hide');
            location.href = '#/tickets';
        });

        // checked state оn tickets  
        $('.btn-filter').on('click', function() {
            var $target = $(this).data('state');
            if ($target !== 'all') {
                $('.table tbody tr').css('display', 'none');
                $('.table tr[data-status="' + $target + '"]').fadeIn('slow');
            } else {
                $('.table tbody tr').css('display', 'none').fadeIn('slow');
            }
        });

        // edit btn to open edit dialog
        $(".edit-icon-btn").on('click', function() {
            let $this = $(this);
            let $id = $this.parents('tr').data('id');
            let $status = $this.parents('tr').data('status');
            $("#update-ticket-btn").attr('data-id', $id);
            $("#update-ticket-btn").attr('data-status', $status);
            $("#edit").modal('show');
        });

        // edit ticket to update ticket
        $("#update-ticket-btn").on('click', function() {
            self.editTicket();
        });

        // delete btn to open idalog
        $(".delete-icon-btn").on('click', function() {
            let $this = $(this);
            let $id = $this.parents('tr').data('id');
            $("#delete-ticket-btn").attr("data-id", $id);
            $("#delete").modal('show');
        });

        // edit ticket to update ticket
        $("#delete-ticket-btn").on('click', function() {
            debugger;
            let $this = $(this);
            let $id = $this.attr('data-id');
            self.deteleTicket($id);
            location.href = "#/tickets/all";
            $("#delete").modal('hide');
        });
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
        let addTemplate = new loadTemplate('tickets-add'),
            self = this,
            categories = this.categories.getCategories();
        console.log(categories);
        addTemplate.getTemplate()
            .then((template) => {
                $('<div id="popupAdd"></div>').appendTo(self.container);
                $('#popupAdd').html(template(categories));
                $("#editТicket").modal('show');
                self.initEvents();
            });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////

    allTickets() {
        let self = this,
            tickets;

        const allUsers = self.users.getUsers();

        this.helpers.priorityHelper();

        let lodaTemplate = new loadTemplate('tickets-all');
        lodaTemplate.getTemplate()
            .then((template) => {
                tickets = this.ticketsModel.getTickets();
                tickets.users = allUsers;
                console.log(tickets);
                return template;
            })
            .then(template => {
                setTimeout(function() {
                    self.container.html(template(tickets));
                    self.initEvents();
                }, 500);
            });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////

    editTicket() {
        let self = this;
        let $id = $("#update-ticket-btn").attr('data-id'),
            $currentState = $("#update-ticket-btn").attr('data-status'),
            $updateState = $("#user-edit-state option:selected").attr('data-state'),
            $getUser = $("#edit-assignee option:selected").attr('data-user');
        if ($currentState !== $updateState) {
            $('.table tr[data-status="' + $currentState + '"]').attr('data-status', $updateState);
            self.updateState($id, $updateState);
        }

        $('.table tr[data-id="' + $id + '"]>td:last-child').text($("#edit-assignee option:selected").text());
        self.ticketsModel.assigneeUserToTask($id, $getUser);
        $("#edit").modal('hide');
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    deteleTicket(ticketId) {
        this.ticketsModel.deleteTicket(ticketId);
    }
}


export { TicketsController };