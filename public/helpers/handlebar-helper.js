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
}

export { Helpers };