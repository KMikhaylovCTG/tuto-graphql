// serveur rest
const express = require('express');
// allow access origin
const cors = require('cors');
// serveur graphQL
const graphQLHTTP = require('express-graphql');
// module nodeJS
const path = require('path');
// récupère tous les éléments de type
const ListTypes = require('./lib/ListTypes');

// schema des types et requêtes
const schema = require('./schema');
// serveur
const app = express();
const port = 5000;
const webRoot = '/graphql';
var lt = new ListTypes(path.join(__dirname, 'types'));

app.use(cors());
app.use(webRoot, graphQLHTTP(function (req) {
    var loaders = lt.getLoaders();
    return {
        context: {loaders},
        schema,
        graphiql: true
    };
}));
app.listen(port);
console.log(`Graphl started at localhost:${port}${webRoot}`);