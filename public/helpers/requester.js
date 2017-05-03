'use strict';

function request(url, type, body, headers) {
    const promise = new Promise((resolve, reject) => $.ajax({
        url: url,
        method: type,
        contentType: 'application/json',
        headers: headers,
        data: JSON.stringify(body),
        success: resolve,
        error: reject
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