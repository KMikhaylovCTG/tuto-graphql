const express = require('express');
const cors = require('cors');
const graphQLHTTP = require('express-graphql');
const path = require('path');

const schema = require('./schema');
const app = express();
const port = 5000;
const webRoot = '/graphql';

app.use(cors());
app.use(webRoot, graphQLHTTP(function (req) {
    return {
        schema,
        graphiql: true
    };
}));
app.listen(port);
console.log(`Graphl started at localhost:${port}${webRoot}`);