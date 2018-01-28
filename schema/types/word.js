const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
  getNullableType
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'WordType',

  fields: () => ({
    _id: { type: GraphQLID },
    value: { type: GraphQLString },
    translations: {
      type: new GraphQLList(GraphQLString),
      resolve: word => getNullableType(word.translations)
    },
    explanations: {
      type: new GraphQLList(GraphQLString),
      resolve: word => getNullableType(word.explanations)
    },
    usages: {
      type: new GraphQLList(GraphQLString),
      resolve: word => getNullableType(word.usages)
    }
  })
});
