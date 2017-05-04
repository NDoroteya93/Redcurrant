'use strict';

function request(url, type, body, headers) {
    const promise = new Promise((resolve, reject) => $.ajax({
        url: url,
        method: type,
        contentType: 'application/json',
        headers: headers,
        data: JSON.stringify(body),
        success: resolve,
        error: function(reject) {

            let response = null;
            let errors = [];
            let errorsString = "";
            if (reject.status == 400) {
                try {
                    response = JSON.parse(reject.responseText);
                } catch (e) {}
            }
            if (response != null) {
                let modelState = response.modelState;
                for (const key in modelState) {
                    if (modelState.hasOwnProperty(key)) {
                        errorsString = (errorsString == "" ? "" : errorsString + "<br/>") + modelState[key];
                        errors.push(modelState[key]); //list of error messages in an array
                    }
                }
            }
            //DISPLAY THE LIST OF ERROR MESSAGES 
            if (errorsString != "") {
                toastr.error(errorsString);
            }
        }
    }));

    return promise;
}

function get(url, headers = {}) {
    return request(url, 'GET', '', headers);
}

function post(url, body = {}, headers = { "Access-Control-Allow-Headers": "*" }) {
    return request(url, 'POST', body, headers);
}

function put(url, body = {}, headers = { "Access-Control-Allow-Headers": "*" }) {
    return request(url, 'PUT', body, headers);
}

const requester = {
    get,
    post,
    put
}

export { requester };