'use strict';

import { CategoryModel } from 'categoryModel';

class CategoryController {
    constructor() {
        this._categoryModel = new CategoryModel;
    }

    get categoryModel() {
        return this._categoryModel;
    }

    getCategory() {}

    addCategory() {
        debugger;
        let self = this;
        // get data from input fields
        const title = $('#category-name').val()

        self.categoryModel.addCategory(title)
            .then((resp) => {
                    toastr.success(`Categoy created successfully`);
                    location.href = '#/admin/categories';
                },
                (errorMsg) => {
                    location.href = '#/admin/categories';
                });
    }

    deleteCategory(categoryId) {
        this.categoryModel.deleteCategory(categoryId);
    }
}

export { CategoryController };