import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from "graphql"

export default new GraphQLObjectType({
  name: "WordType",

  fields: () => ({
    _id: { type: GraphQLID },
    value: { type: GraphQLString },
    createdDate: {
      type: GraphQLString,
      resolve: word => (word.createdDate ? word.createdDate.toISOString() : "")
    },
    updatedDate: {
      type: GraphQLString,
      resolve: word => (word.updatedDate ? word.updatedDate.toISOString() : "")
    },
    translations: {
      type: new GraphQLList(GraphQLString),
      resolve: word => word.translations || []
    },
    explanations: {
      type: new GraphQLList(GraphQLString),
      resolve: word => word.explanations || []
    },
    usages: {
      type: new GraphQLList(GraphQLString),
      resolve: word => word.usages || []
    }
  })
})
