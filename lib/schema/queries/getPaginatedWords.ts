import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType
} from "graphql";

import mongoDb from "../../database/mongodb";
import WordType from "../types/word";

const PaginatedWordsType = new GraphQLObjectType({
  name: "PaginatedWordsType",

  fields: () => ({
    total: {
      type: GraphQLInt,
      resolve: pagination => pagination.total
    },
    items: {
      type: new GraphQLList(WordType),
      resolve: pagination => pagination.words || []
    }
  })
});

export default {
  name: "GetPaginatedWordsQuery",

  type: PaginatedWordsType,
  description:
    "Paginated words defined by the page and number of words per page",
  args: {
    page: { type: new GraphQLNonNull(GraphQLInt) },
    itemsPerPage: { type: new GraphQLNonNull(GraphQLInt) }
  },

  resolve: (_: any, args: any, { mPool }: any) => {
    return mongoDb(mPool).getWords(args);
  }
};
