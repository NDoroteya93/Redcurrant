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

    }

    logout(manager) {
        manager
            .signoutRedirect()
            .catch(function(error) {
                console.error('error while signing out user', error);
            });
    }

    register() {

    }


}

export { UserController };