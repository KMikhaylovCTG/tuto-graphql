const fetch = require('node-fetch');
const FormData = require('form-data');
const querystring = require("querystring");
const DataLoader = require('dataloader');

const RestServices = function (baseUrl, debug) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.debug = (debug);

    this.create = function (item) {
        var url = `${this.baseUrl}/`;
        var formData = new FormData();
        for (var i in item) {
            formData.append(i, item[i]);
        }
        return fetch(url, {method: 'POST', body: formData})
            .then(res => res.json())
            .then(json => json.data);
    };

    this._read = function (id, baseUrl, debug) {
        var url = `${baseUrl}/${id}`;
        if (debug) {
            console.log('_read', url);
        }
        return fetch(url)
            .then(res => res.json())
            .then(json => json.data);
    };

    this.read = function (id) {
        if (this.debug) {
            console.log('read');
        }
        this._read(id, this.baseUrl, this.debug);
    };

    this.readAll = function (params) {
        var query = querystring.stringify(params);
        var url = `${this.baseUrl}/`;
        if (query.length > 0) {
            url += '?';
            url += query;
        }
        if (this.debug) {
            console.log('readAll', url);
        }
        return fetch(url)
            .then(res => res.json())
            .then(json => json.data);
    };

    this.update = function (item) {
        var url = `${this.baseUrl}/${item.id}`;
        if (this.debug) {
            console.log('update', url);
        }
        var formData = new FormData();
        for (var i in item) {
            formData.append(i, item[i]);
        }
        return fetch(url, {method: 'POST', body: formData})
            .then(res => res.json())
            .then(json => json.data);
    };

    this.delete = function (id) {
        var url = `${this.baseUrl}/${id}`;
        if (this.debug) {
            console.log('delete', url);
        }
        return fetch(url, {method: 'DELETE'})
            .then(res => res.json())
            .then(json => json.data);
    };

    this.dataLoader = function () {
        var _this = this;
        function readForLoader(item) {
            if (typeof item === 'object') {
                return _this._read(item.id, _this.baseUrl, _this.debug);
            } else {
                return _this._read(item, _this.baseUrl, _this.debug);
            }
        }
        return new DataLoader(
            keys => Promise.all(keys.map(readForLoader))
        );
    };
};

module.exports = RestServices;