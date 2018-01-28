const {
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const mongoDb = require('../../database/mongodb');
const WordType = require('../types/word');

module.exports = {
  name: 'GetWordQuery',
  type: WordType,
  description: 'The word identified by the id',
  args: {
    key: { type: new GraphQLNonNull(GraphQLString) }
  },
  // obj - parent object we are representing
  // args - values of the fields args passed from the user, args.key
  // context - object that is passed down from the executor
  resolve: (obj, args, { mPool }) => {
    return mongoDb(mPool).getWord(args.key);
  }
};

