'use strict';

import { UserModel } from 'userModel';
import { loadTemplate } from 'templates';
import { TicketsController } from 'ticketsController';
import { CategoryModel } from 'categoryModel';
import { CategoryController } from 'categoryController';
import { Helpers } from 'helpers';

const LOCAL_STORAGE_USERNAME_KEY = 'signed-in-user-username',
    LOCAL_STORAGE_AUTHKEY_KEY = 'signed-in-user-auth-key';


class UserController {
    constructor() {
        this._userModel = new UserModel;
        this._container = $('#container');
        this._tickets = new TicketsController;
        this._categories = new CategoryModel;
        this._categoryController = new CategoryController;
        this._helpers = new Helpers;
    }

    get userModel() {
        return this._userModel;
    }

    get container() {
        return this._container;
    }

    get tickets() { return this._tickets; }

    get helpers() {
        return this._helpers;
    }

    get categories() {
        return this._categories;
    }

    get categoryController() {
        return this._categoryController;
    }

    loadTemplate(templateName, data) {
        data = data || '';
        // load template
        let self = this;
        const getTemplate = new loadTemplate(templateName);
        getTemplate.getTemplate()
            .then(template => {
                self.container.html(template(data));
            });
    }

    login(manager) {
        $(".signed-user").removeClass('hidden');
        $(".unsigned-user").addClass('hidden');
        manager
            .signinPopup();

    }

    logout(manager) {
        $(".signed-user").addClass('hidden');
        $(".unsigned-user").removeClass('hidden');
        manager
            .signoutRedirect()
            .catch(function(error) {
                console.error('error while signing out user', error);
            });

    }

    register() {
        let self = this;
        // get data from input fields
        const email = $('#emailaddr').val(),
            username = $("#reg-username").val(),
            firstName = $('#fname-user').val(),
            lastName = $('#lname-user').val(),
            password = $('#reg-password').val(),
            confirmPass = $('#confirmpass').val();

        self.userModel.register(email, username, firstName, lastName, password, confirmPass)
            .then((resp) => {
                    toastr.success(`User ${username} registered successfully`);
                    location.href = '#/tickets';
                },
                (errorMsg) => {
                    location.href = '#/register';
                });
    };

    allUsers() {
        let self = this,
            users;

        let template = new loadTemplate('users');
        template.getTemplate()
            .then((res) => {
                users = this.userModel.getUsers();
                return res;
            })
            .then((res) => {
                setTimeout(function() {
                    $("#users").html(res(users));
                }, 1000)
            });
    };

    getUser() {
        let self = this,
            variableNames = [],
            uri = self._container[0].baseURI,
            route = '/user/:username',
            user;

        route = route.replace(/([:*])(\w+)/g, function(full, dots, name) {
            variableNames.push(name);
            return '([^\/]+)';
        }) + '(?:\/|$)';
        let userName = uri.match(new RegExp(route))[1];

        let template = new loadTemplate('user');
        template.getTemplate()
            .then((res) => {
                user = this.userModel.getUser(userName);
                return res;
            })
            .then((res) => {
                setTimeout(function() {
                    $("#users").html(res(user));
                }, 1000)
            });
    };

    viewUserProfile() {
        this.helpers.loadCanvas();
        let self = this;
        let dataTickets = [],
            taskStates = [],
            todo = 0,
            done = 0,
            progress = 0;

        // get data for current user
        this.tickets.getTicketForCurrentUser()
            .then((res) => {
                res.forEach((ticket) => {
                    if (ticket.taskState === 0) {
                        todo++;
                    } else if (ticket.taskState === 1) {
                        progress++;
                    } else if (ticket.taskState === 2) {
                        done++;
                    }
                    dataTickets.push(ticket);
                });
                taskStates.push(todo, progress, done);
                return dataTickets;
            }).then((dataTickets) => {
                self.loadTemplate('admin', { data: dataTickets });
            }).then(() => {
                setTimeout(function() {
                    self.createChart(taskStates);
                }, 1500)
            })

        this.filter();
        // Events
        $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function(e) {
            let href = e.target.href.split('#')[1];
            if (href !== 'dashboard') {
                location.href = '#/admin/' + href;
            }
        });

        $(document).on("click", ".sidebar-toggle", function() {
            $(".wrapper").toggleClass("toggled");
        });

    }

    createChart(dataState) {
        // data for chart
        let data = {
            labels: [
                "ToDo",
                "In Progress",
                "Done"
            ],
            datasets: [{
                data: dataState,
                backgroundColor: [
                    "#ec971f",
                    "#ff0000",
                    "#4cae4c"
                ],
                hoverBackgroundColor: [
                    "#ce8621",
                    "#d80202",
                    "#53b353"
                ]
            }]
        };
        // Pie Chart
        let ctx = $("#pieChart")[0].getContext('2d');
        let pieChart = new Chart(
            ctx, {
                type: 'pie',
                data: data,
                options: {
                    animation: {
                        animateScale: true
                    }
                }
            });

    }

    filter() {
        $(".table-user-ticket span.filter").unbind();
        // attach table filter plugin to inputs
        $(document).on('keyup', '[data-action="filter"]', function(e) {
            $('.filterTable_no_results').remove();
            var $this = $(this),
                search = $this.val().toLowerCase(),
                target = $this.attr('data-filters'),
                $target = $(target),
                $rows = $target.find('tbody tr');

            if (search == '') {
                $rows.show();
            } else {
                $rows.each(function() {
                    var $this = $(this);
                    $this.text().toLowerCase().indexOf(search) === -1 ? $this.hide() : $this.show();
                })
                if ($target.find('tbody tr:visible').length === 0) {
                    var col_count = $target.find('tr').first().find('td').size();
                    var no_results = $('<tr class="filterTable_no_results"><td colspan="' + col_count + '">No results found</td></tr>')
                    $target.find('tbody').append(no_results);
                }
            }
        });


        $(document).on('click', '.table-user-tickets span.filter', function(e) {
            var $this = $(this),
                $panel = $this.parents('.panel');

            $panel.find('.panel-body').slideToggle();
            if ($this.css('display') != 'none') {
                $panel.find('.panel-body input').focus();
            }
        });
        $('[data-toggle="tooltip"]').tooltip();
        // attach table filter plugin to inputs
    }

    // change password 
    changePass() {
        const getTemplate = new loadTemplate('changepass');
        getTemplate.getTemplate()
            .then(template => {
                $("#configuration").html(template());
            });
    }

    getCategories() {
        let self = this;
        const getTemplate = new loadTemplate('categories');
        let categories = this.categories.getCategories();
        getTemplate.getTemplate()
            .then(template => {
                setTimeout(function() {
                    $("#categories").html(template({ data: categories }));
                    $('#add-category-btn').on('click', function() {
                        self.addCategory();
                        $("#addCategory").modal('hide');
                    });
                }, 500);
            });
    }

    addCategory() {
        this.categoryController.addCategory();
    }
}


export { UserController };