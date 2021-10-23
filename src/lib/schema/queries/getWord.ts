import { GraphQLNonNull, GraphQLString } from "graphql";

import mongoDb from "../../database/mongodb";
import WordType from "../types/word";

export default {
  name: "GetWordQuery",
  type: WordType,
  description: "The word identified by the id",
  args: {
    key: { type: new GraphQLNonNull(GraphQLString) },
  },
  // obj - parent object we are representing
  // args - values of the fields args passed from the user, args.key
  // context - object that is passed down from the executor
  resolve: (_: any, args: any, { mPool, dbName, collectionName }: any) => {
    return mongoDb(mPool, dbName, collectionName).getWord(args.key);
  },
};
