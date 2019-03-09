import { GraphQLObjectType, GraphQLSchema } from "graphql"
import SaveWordMutation from "./mutations/saveWord"
import getPaginatedWordsQuery from "./queries/getPaginatedWords"
import getWordQuery from "./queries/getWord"

// data is modelled as a graph => the root query type is where in the data graph we
// can start asking questions, the starting point to traverse the graph. All fields
// placed here will be available on the top level query selection scope
const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    word: getWordQuery,
    words: getPaginatedWordsQuery
  })
})

// graphql object with a name and fields, but fields are commands
const RootMutationType = new GraphQLObjectType({
  name: "RootMutationType",
  fields: () => ({
    SaveWord: SaveWordMutation
  })
})

const ncSchema = new GraphQLSchema({
  // those too are expected to be GraphQLObjectType
  query: RootQueryType,
  mutation: RootMutationType
})

export default ncSchema
