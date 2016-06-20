const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const path = require('path');
const ListTypes = require('./lib/ListTypes');

var lt = new ListTypes(path.join(__dirname, 'types'));
var queries = lt.getQueries();
//var lt.getMutations();

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Requêtes Read',
    fields: () => (queries)
});

/*const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Requêtes Create, Update, Delete',
    fields: () => (mutations)
});*/

const Schema = new GraphQLSchema({
    query: QueryType,
    //mutation: MutationType
});

module.exports = Schema;