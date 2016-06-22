const GraphQLString = require('graphql').GraphQLString;
const GraphQLObjectType = require('graphql').GraphQLObjectType;

const paths = require('../paths.js');
const fetchByUrl = require('../lib/SwFetch').byUrl;
//const fetchByPage = require('../lib/SwFetch').byPage;

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
        <?php echo $typeUrl ?>: {
            type: <?php echo $typeName; ?>Type,
            args: {
                id: {type: GraphQLString}
            },
            resolve: (root, args) =>
                fetchByUrl(`${BASE_URL}/${args.id}/`)
        }
    }
};