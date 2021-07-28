import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";

import mongoDb, { DeleteWordResponse } from "../../database/mongodb";

const deleteWordType = new GraphQLObjectType({
  name: "DeleteWordType",
  fields: () => ({
    deleted: {
      type: GraphQLBoolean,
      resolve: (resp: DeleteWordResponse) => resp.ok && !!resp.n && resp.n >= 1
    }
  })
});

const WordInputType = new GraphQLInputObjectType({
  name: "DeleteWordInputType",
  fields: () => ({
    id: { type: GraphQLString }
  })
});

export default {
  // what we want enable the user to read after we have done the mutation,
  // this should match the resolved value in the resolve function
  type: deleteWordType,
  // user's input
  args: {
    input: { type: new GraphQLNonNull(WordInputType) }
  },
  resolve: (_: any, { input }: any, { mPool }: any) => {
    return mongoDb(mPool).deleteWord(input.id);
  }
};
