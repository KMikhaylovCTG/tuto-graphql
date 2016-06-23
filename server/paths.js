const path = require('path');

module.exports = {
    baseUrl: 'http://swapi.co/api',
    reactSrc: path.join(path.dirname(__dirname), 'react/src/*.js'),
    reactLib: path.join(path.dirname(__dirname), 'react/lib'),
    typesSrc: path.join(__dirname, 'types'),
    schemaSrc: path.join(__dirname, 'schema.js'),
    schemaJson: path.join(__dirname, 'schema.json'),
    schemaGraphQL: path.join(__dirname, 'schema.graphql'),
    schemaTransform: path.join(__dirname, 'lib/schemaTransform')
};