import {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString
} from "graphql"

import mongoDb from "../../database/mongodb"
import WordType from "../types/word"

const WordInputType = new GraphQLInputObjectType({
  name: "WordInputType",
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
})

export default {
  // what we want enable the user to read after we have done the mutation,
  // this should match the resolved value in the resolve function
  type: WordType,
  // user's input
  args: {
    input: { type: new GraphQLNonNull(WordInputType) }
  },
  resolve(_: any, { input }: any, { mPool }: any) {
    return mongoDb(mPool).saveWord(input)
  }
}
