/**
 * Created by sylvain.conny on 18/05/2016.
 */

const fs = require('fs');
const path = require('path');
const {graphql} = require('graphql');
const {introspectionQuery, printSchema} = require('graphql/utilities');
const {schemaSrc, schemaJson, schemaGraphQL} = require('../paths');

var schema = require(schemaSrc);

graphql(schema, introspectionQuery).then(result => {
    fs.writeFileSync(
        schemaJson,
        JSON.stringify(result, null, 2)
    );
});

fs.writeFileSync(
    schemaGraphQL,
    printSchema(schema)
);