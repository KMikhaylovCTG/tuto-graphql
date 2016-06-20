module.exports = function (path) {

    this.typePath = path;
    this.path = require('path');
    this.files = [];
    this.queries = {};
    this.mutations = {};
    this.loaders = {};
    this.readed = false;

    this.read = function () {
        var fs = require('fs');
        this.files = fs.readdirSync(this.typePath);
        this.readed = true;
    };


    this.getLoaders = function () {
        if (!this.readed) {
            this.read();
        }
        for (var i in this.files) {
            var item = this.files[i].toLowerCase().replace(/\.js$/ig, '');
            this.loaders[item] = require(this.path.join(this.typePath, this.files[i])).loader;
        }
        return this.loaders;
    };

    this.getQueries = function () {
        if (!this.readed) {
            this.read();
        }
        for (var i in this.files) {
            var typeQueries = require(this.path.join(this.typePath, this.files[i])).queries;
            for (var j in typeQueries) {
                this.queries[j] = typeQueries[j];
            }
        }
        return this.queries;
    };

    this.getMutations = function () {
        if (!this.readed) {
            this.read();
        }
        for (var i in this.files) {
            var typeMutations = require(this.path.join(this.typePath, this.files[i])).mutations;
            for (var j in typeMutations) {
                this.mutations[j] = typeMutations[j];
            }
        }
        return this.mutations;
    };
};