'use strict';

import { requester } from 'requester';

const LOCAL_STORAGE_USERNAME_KEY = 'signed-in-user-username',
    LOCAL_STORAGE_AUTHKEY_KEY = 'signed-in-user-auth-key',
    API = 'https://130.204.27.87:44313/api';

class CategoryModel {
    constructor() {

    }

    getCategories() {
        let categories = [];
        requester.get(API + '/GetCategories')
            .then((res) => {
                res.forEach((category) => {
                    categories.push(category);
                })
            });
        return categories;
    }

    addCategory(title) {
        const body = {
            name: title
        }
        return requester.post(API + '/CreateCategoryr', body);
    }

    updateCategory(id, title) {
        const body = {
            id: id,
            name: title
        }
        return requester.post(API + '/UpdateCategoryr', body);
    }

    deleteCategory(Id) {
        const body = {
            id: Id
        }
        return requester.post(API + '/DeleteCategoryr', body);
    }


}

export { CategoryModel };