const {
  GraphQLSchema,
  GraphQLObjectType
} = require('graphql');

// data is modelled as a graph => the root query type is where in the data graph we 
// can start asking questions, the starting point to traverse the graph. All fields 
// placed here will be available on the top level query selection scope
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => {
    const getWordQuery = require('./queries/getWord');
    const getPaginatedWordsQuery = require('./queries/getPaginatedWords');

    return {
      word: getWordQuery,
      words: getPaginatedWordsQuery
    };
  }
});

const SaveWordMutation = require('./mutations/saveWord');

// graphql object with a name and fields, but fields are commands
const RootMutationType = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: () => ({
    SaveWord: SaveWordMutation
  })
});

const ncSchema = new GraphQLSchema ({
  // those too are expected to be GraphQLObjectType
  query: RootQueryType,
  mutation: RootMutationType
});

module.exports = ncSchema;