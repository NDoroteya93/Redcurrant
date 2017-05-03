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

    login(manager) {

        manager
            .signinPopup()
            .catch(function(error) {
                console.error('error while logging in through the popup', error);
            });
        $(".signed-user").removeClass('hidden');
        location.href = '#/home';

    }

    logout(manager) {
        manager
            .signoutRedirect()
            .catch(function(error) {
                console.error('error while signing out user', error);
            });
        $(".signed-user").addClass('hidden');
        location.href = '#/home';
    }

    register() {
        // load template
        const getTemplate = new loadTemplate('user-register');
        let self = this;
        getTemplate.getTemplate()
            .then(template => {
                self.container.html(template());
            });

        // get data from input fields
        debugger;

        $("#submitbtn").on('click', function() {
            debugger;
            const email = $('#emailaddr').val(),
                username = $("#reg-username").val(),
                firstName = $('#fname-user').val(),
                lastName = $('#lname-user').val(),
                password = $('#reg-password').val(),
                confirmPass = $('#confirmpass').val();

            self.userModel.register(email, username, firstName, lastName, password, confirmPass)
                .then((resp) => {
                        toastr.success(`User ${username} registered successfully`);
                        location.href = '#/tickets'
                    },
                    errorMsg => toastr.error(errorMsg));
        });
    }
}


export { UserController };