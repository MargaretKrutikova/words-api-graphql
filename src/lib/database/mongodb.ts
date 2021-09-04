import {
  DeleteResult,
  FindOneAndUpdateOptions,
  MongoClient,
  ObjectId,
} from "mongodb";
import { ApiWordEntity, WordMutationModel } from "../types";
import { getReplacementFields } from "./util";

export type PaginatedWordsRequest = {
  readonly page: number;
  readonly itemsPerPage: number;
  readonly tags?: ReadonlyArray<string>;
};

type MongoDbService = {
  getWord: (wordId: ObjectId) => Promise<ApiWordEntity | undefined>;
  getWords: (
    request: PaginatedWordsRequest
  ) => Promise<{ words: ApiWordEntity[]; total: number }>;
  deleteWord: (id: string) => Promise<DeleteResult>;
  saveWord: (word: WordMutationModel) => Promise<ApiWordEntity | undefined>;
};

export default (
  mPool: MongoClient,
  dbName: string,
  collectionName: string
): MongoDbService => {
  const getWordsCollection = () =>
    mPool.db(dbName).collection<ApiWordEntity>(collectionName);

  return {
    getWord: (wordId: ObjectId) =>
      getWordsCollection().findOne({ _id: new ObjectId(wordId) }),

    getWords: async ({ page, itemsPerPage, tags }: PaginatedWordsRequest) => {
      const getTagsFilter = () => {
        if (tags === undefined) return {};

        if (tags.length === 0)
          return { $or: [{ tags: undefined }, { tags: [] }] };

        return { tags: { $all: [...tags] } };
      };

      const filteredWordsCollection = getWordsCollection().find(
        getTagsFilter()
      );

      const getPaginatedPromise = filteredWordsCollection
        .sort({ createdDate: -1 })
        .limit(itemsPerPage)
        .skip(page > 0 ? (page - 1) * itemsPerPage : 0)
        .toArray();

      const getTotalPromise = filteredWordsCollection.count();

      const values = await Promise.all([getPaginatedPromise, getTotalPromise]);
      return {
        words: values[0],
        total: values[1],
      };
    },

    deleteWord: async (id: string): Promise<DeleteResult> => {
      const data = await getWordsCollection().deleteOne({
        _id: new ObjectId(id),
      });

      return data;
    },

    saveWord: async (word: WordMutationModel) => {
      const date = new Date();

      const {
        id,
        createdDate: createdDateString,
        updatedDate: updatedDateString,
        ...fieldsToSave
      } = word;

      const getCreatedDateIfNew = () => (!id ? date : undefined);

      const createdDate = createdDateString
        ? new Date(createdDateString)
        : getCreatedDateIfNew();

      const updatedDate = updatedDateString
        ? new Date(updatedDateString)
        : date;

      const { fieldsToSet, fieldsToUnset } = getReplacementFields(fieldsToSave);

      const setCreated = createdDate
        ? { createdDate: new Date(createdDate) }
        : {};
      const setUpdated = updatedDate
        ? { updatedDate: new Date(updatedDate) }
        : {};

      // if $unset is an empty object, mongo will throw an exception.
      const unsetObj =
        Object.keys(fieldsToUnset).length > 0
          ? { $unset: { ...fieldsToUnset } }
          : {};

      const options: FindOneAndUpdateOptions = {
        upsert: true,
        returnDocument: "after",
      };

      const data = await getWordsCollection().findOneAndUpdate(
        { _id: new ObjectId(id) }, // query
        {
          $set: { ...fieldsToSet, ...setCreated, ...setUpdated },
          ...unsetObj,
        }, // replacement object
        options
      );

      return data.value;
    },
  };
};
