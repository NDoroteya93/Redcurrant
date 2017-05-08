'use strict';

import { UserModel } from 'userModel';
import { loadTemplate } from 'templates';
import { TicketsController } from 'ticketsController';

const LOCAL_STORAGE_USERNAME_KEY = 'signed-in-user-username',
    LOCAL_STORAGE_AUTHKEY_KEY = 'signed-in-user-auth-key';


class UserController {
    constructor() {
        this._userModel = new UserModel;
        this._container = $('#container');
        this._tickets = new TicketsController;
    }

    get userModel() {
        return this._userModel;
    }

    get container() {
        return this._container;
    }

    get tickets() { return this._tickets; }

    loadTemplate(templateName) {
        // load template
        let self = this;
        const getTemplate = new loadTemplate(templateName);
        getTemplate.getTemplate()
            .then(template => {
                self.container.html(template());
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
        let self = this;
        this.loadTemplate('admin');
        setTimeout(function() {
            self.createChart();
        }, 500)

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

    createChart() {
        let dataTickets,
            taskStates = [],
            todo = 0,
            done = 0,
            progress = 0;

        // data for chart
        let data = {
            labels: [
                "ToDo",
                "In Progress",
                "Done"
            ],
            datasets: [{
                data: taskStates,
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
        this.tickets.getTicketForCurrentUser()
            .then((res) => {
                res.forEach((ticket) => {
                    debugger;
                    if (ticket.taskState === 0) {
                        todo++;
                    } else if (ticket.taskState === 1) {
                        progress++;
                    } else if (ticket.taskState === 2) {
                        done++;
                    }
                });
                taskStates.push(todo, progress, done);
                // Pie Chart
                let ctx = ctx = $("#pieChart")[0].getContext('2d');
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
            });

        console.log(taskStates);




    }
}


export { UserController };