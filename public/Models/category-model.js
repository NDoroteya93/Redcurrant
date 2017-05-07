'use strict';

import { requester } from 'requester';

const LOCAL_STORAGE_USERNAME_KEY = 'signed-in-user-username',
    LOCAL_STORAGE_AUTHKEY_KEY = 'signed-in-user-auth-key';

class CategoryModel {
    constructor() {

    }

    getCategories() {
        let self = this,
            categories;
        requester.get('https://130.204.27.87:44313/api/GetCategories')
            .then((res) => {
                categories = res;
            });
        return states;
    }
}

export { CategoryModel };