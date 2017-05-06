
'use strict';

import { UserModel } from 'userModel';
import { loadTemplate } from 'templates';

const LOCAL_STORAGE_USERNAME_KEY = 'signed-in-user-username',
    LOCAL_STORAGE_AUTHKEY_KEY = 'signed-in-user-auth-key';


class UserController {
    constructor() {
        this._userModel = new UserModel;
        this._container = $('#container');
    }

    get userModel() {
        return this._userModel;
    }

    get container() {
        return this._container;
    }

    loadTemplate(templateName) {
        // load template
        const getTemplate = new loadTemplate(templateName);
        let self = this;
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
                    console.log(errorMsg);
                    location.href = '#/register';
                });
    }

    allUsers() {
        let self = this,
            users;

        let template = new loadTemplate('users');
        template.getTemplate()
            .then((res) => {
                users = this.userModel.getUsers();
                return res;
            })
            .then(res => {
                setTimeout(function() {
                    self.container.html(res(users));
                }, 1000)
            });
    }
}


export { UserController };
