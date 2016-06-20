const GraphQLString = require('graphql').GraphQLString;
const GraphQLObjectType = require('graphql').GraphQLObjectType;

const fetch = require('node-fetch');
const paths = require('../paths.js');

const BASE_URL = `${paths.baseUrl}/<?php echo $typeUrl ?>`;

const <?php echo $typeName; ?>Type = new GraphQLObjectType({
    name: '<?php echo $typeName; ?>',
    description: '...',
    fields: () => ({
        url: {type: GraphQLString},
    })
});

module.exports = {
    item: <?php echo $typeName; ?>Type,
    queries: {
        people: {
            type: <?php echo $typeName; ?>Type,
            args: {
                id: {type: GraphQLString}
            },
            resolve: (root, args) => fetch(`${BASE_URL}/${args.id}/`)
                .then(res => res.json())
        }
    }
};