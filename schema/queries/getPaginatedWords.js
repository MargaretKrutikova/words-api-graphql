const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  getNullableType
} = require('graphql');

const mongoDb = require('../../database/mongodb');
const WordType = require('../types/word');

const PaginatedWordsType = new GraphQLObjectType({
  name: 'PaginatedWordsType',

  fields: () => ({
    total: {
      type: GraphQLInt,
      resolve: pagination => (pagination.total)
    },
    items: {
      type: new GraphQLList(WordType),
      resolve: pagination => getNullableType(pagination.words)
    }
  })
});

module.exports = {
  name: 'GetPaginatedWordsQuery',

  type: PaginatedWordsType,
  description: 'Paginated words defined by the page and number of words per page',
  args: {
    page: { type: new GraphQLNonNull(GraphQLInt) },
    itemsPerPage: { type: new GraphQLNonNull(GraphQLInt) }
  },

  resolve: (obj, args, { mPool }) => {
    return mongoDb(mPool).getWords(args);
  }
};