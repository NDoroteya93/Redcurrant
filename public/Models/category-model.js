'use strict';

import { requester } from 'requester';

const LOCAL_STORAGE_USERNAME_KEY = 'signed-in-user-username',
    LOCAL_STORAGE_AUTHKEY_KEY = 'signed-in-user-auth-key';

class CategoryModel {
    constructor() {

    }

    getCategories() {
        debugger;
        let categories = [];
        requester.get('https://130.204.27.87:44313/api/GetCategories')
            .then((res) => {
                res.forEach((category) => {
                    categories.push(category);
                })
            });
        return categories;
    }


}

export { CategoryModel };