const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

const WordType = require('../types/word');
const mongoDb = require('../../database/mongodb');

const WordInputType = new GraphQLInputObjectType({
  name: 'WordInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    value: { type: new GraphQLNonNull(GraphQLString) },
    translations: {
      type: new GraphQLList(GraphQLString)
    },
    explanations: {
      type: new GraphQLList(GraphQLString)
    },
    usages: {
      type: new GraphQLList(GraphQLString)
    }
  })
});

module.exports = {
  // what we want enable the user to read after we have done the mutation,
  // this should match the resolved value in the resolve function
  type: WordType,
  // user's input
  args: {
    input: { type: new GraphQLNonNull(WordInputType) }
  },
  resolve(obj, { input }, { mPool }) {
    return mongoDb(mPool).saveWord(input);
  }
};