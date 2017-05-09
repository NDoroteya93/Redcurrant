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

    ticketTemplate() {
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

        $('.view-comments').on('click', function() {
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
            let $target = $(this).data('state');
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
            let $this = $(this);
            let $id = $this.attr('data-id');
            self.deteleTicket($id);
            self.allTickets();
            $("#delete").modal('hide');
        });
        // lation on close modal popup
        jQuery(function($) {
            $('#editТicket').on('hidden.bs.modal', function(e) {
                location.href = "#/tickets";
            });
        });

        // send comment on enter
        $("#tickets-details-container").keypress(function(e) {
            let $comment = $("#createNewComment").val(),
                $id = $("#tickets-details-container").attr('data-id');
            if (e.which == 13) {
                self.addComment($id, $comment);
            }
        });
        // send comment on click
        $("#sendComment").on('click', function() {
            let $comment = $("#createNewComment").val(),
                $id = $("#tickets-details-container").attr('data-id');
            self.addComment($id, $comment);

        });

        // show comments
        $("#showComment").on('click', function() {
            if ($('#container-comments').hasClass('hidden')) {
                $('#container-comments').removeClass('hidden');
            } else {
                $('#container-comments').addClass('hidden');
            }
        });

        //assignee user to task
        $(".changeAssignee").on('click', function() {
            let $this = $(this),
                $useriId = $this.attr('data-id'),
                $taskId = $("#tickets-details-container").attr('data-id'),
                $user = $this.text().trim();
            $(".tagAssignedUser").text('#' + $user);
            $(".tagAssignedUser").attr('href', `#/user/${$user}`);
            $("#dropdownMenu1").text($user);
            self.ticketsModel.assigneeUserToTask($taskId, $useriId);
        });

        // change state 
        $(".btn-state").on('click', function() {
            let $target = $(this).data('state'),
                $state = $(this).text().trim(),
                $taskId = $("#tickets-details-container").attr('data-id');
            self.updateState($taskId, $target);
            $('.tagStateUser').text('#' + $state);
        });

        // delete comment btn
        $(".delete-comment-btn").on('click', function() {
            let $id = $(this).parents('.panel-body').attr('data-comment');
            self.deleteComment($id);
            $(this).parents('.panel-body').remove();
        });

        // hide comment
        $('.hideComment').on('click', function() {
            $(this).parents('.panel-body').addClass('hidden');
        });

        // share on facebook  FIX IT!!
        $(".shareFbBtn").on('click', function(e) {
            e.preventDefault();
            FB.ui({
                method: 'share',
                href: 'https://developers.facebook.com/docs/',
            }, function(response) {});
            // FB.ui({
            //         method: 'feed',
            //         name: 'Facebook Dialogs',
            //         link: 'http://localhost:92/public',
            //         picture: 'http://fbrell.com/f8.jpg',
            //         caption: 'Reference Documentation',
            //         description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
            //     },
            //     function(response) {
            //         if (response && response.post_id) {
            //             alert('Post was published.');
            //         } else {
            //             alert('Post was not published.');
            //         }
            //     }
            // );
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
        debugger;
        let self = this,
            details;
        const allUsers = self.users.getUsers();
        let template = new loadTemplate('tickets-details');
        template.getTemplate()
            .then((res) => {
                details = this.ticketsModel.getTicketsDetails(id);
                details.users = allUsers;
                console.log(details);
                return res;
            })
            .then(res => {
                setTimeout(function() {
                    self.container.html(res(details));
                    self.initEvents();
                }, 1000)
            });
    }

    // add ticket
    addTicket() {
        let addTemplate = new loadTemplate('tickets-add'),
            self = this,
            categories = this.categories.getCategories();
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
                return template;
            })
            .then(template => {
                setTimeout(function() {
                    $("#alltickets").html(template(tickets));
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

    /////////////////////////////////////////////////////////////////////////////////////////////////
    addComment(ticketId, comment) {
        this.ticketsModel.addComment(ticketId, comment);
        location.href = '#/tickets/details/' + ticketId;
        $("#container-comments").removeClass('hidden');
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    getTicketForCurrentUser() {
        let currentUser = this.ticketsModel.getTicketForCurrentUser();
        return Promise.resolve(currentUser);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    deleteComment(id) {
        this.ticketsModel.deleteComment(id);
    }

    /// Search
    searchTicketByTitle(string) {
        let self = this,
            tickets;

        if (!string) {
            let variableNames = [],
                uri = self._container[0].baseURI,
                route = '/FindTiketsByTitle/:string';
            route = route.replace(/([:*])(\w+)/g, function(full, dots, name) {
                variableNames.push(name);
                return '([^\/]+)';
            }) + '(?:\/|$)';

            string = uri.match(new RegExp(route))[1];
        }

        this.helpers.priorityHelper();

        let template = new loadTemplate('tickets-results');
        template.getTemplate()
            .then((res) => {
                tickets = this.ticketsModel.searchTickets(string);
                return res;
            })
            .then((res) => {
                setTimeout(function() {
                    self.container.html(res(tickets));
                }, 1000);
            });
    }
}

export { TicketsController };