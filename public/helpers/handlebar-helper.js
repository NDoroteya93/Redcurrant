'use strict';

class Helpers {
    console() {}

    priorityHelper() {
        Handlebars.registerHelper('enum', function(num) {
            if (num === 0) {
                return new Handlebars.SafeString('Low');
            } else if (num === 1) {
                return new Handlebars.SafeString('Medium');
            } else if (num === 2) {
                return new Handlebars.SafeString('High');
            }
        });
    }

    taskState() {
        Handlebars.registerHelper('checked', function(num) {
            if (num === 0) {
                return new Handlebars.SafeString('checked');
            } else if (num === 1) {
                return new Handlebars.SafeString('checked');
            } else if (num === 2) {
                return new Handlebars.SafeString('checked');
            }
        });
    }
}

export { Helpers };