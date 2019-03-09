import { DeleteWriteOpResultObject, MongoClient, ObjectId } from "mongodb"
import { ApiWordEntity, WordMutationModel } from "../types"
import { getReplacementFields } from "./util"

export type PaginatedWordsRequest = {
  readonly page: number
  readonly itemsPerPage: number
}

export type DeleteWordResponse = DeleteWriteOpResultObject["result"]

export default (mPool: MongoClient) => {
  const getWordsCollection = () => mPool.db().collection<ApiWordEntity>("words")

  return {
    getWord: (wordId: ObjectId) =>
      getWordsCollection().findOne({ _id: new ObjectId(wordId) }),

    getWords: async ({ page, itemsPerPage }: PaginatedWordsRequest) => {
      const getPaginatedPromise = getWordsCollection()
        .find()
        .sort({ createdDate: -1 })
        .limit(itemsPerPage)
        .skip(page > 0 ? (page - 1) * itemsPerPage : 0)
        .toArray()

      const getTotalPromise = getWordsCollection().countDocuments()

      const values = await Promise.all([getPaginatedPromise, getTotalPromise])
      return {
        words: values[0],
        total: values[1]
      }
    },

    deleteWord: async (id: string): Promise<DeleteWordResponse> => {
      const data = await getWordsCollection().deleteOne({
        _id: new ObjectId(id)
      })

      return data.result
    },

    saveWord: async (word: WordMutationModel) => {
      const date = new Date()
      const { id, ...fieldsToSave } = word

      const { fieldsToSet, fieldsToUnset } = getReplacementFields(fieldsToSave)

      const setCreated = !id ? { createdDate: date } : {}
      const setUpdated = { updatedDate: date }

      // if $unset is an empty object, mongo will throw an exception.
      const unsetObj =
        Object.keys(fieldsToUnset).length > 0
          ? { $unset: { ...fieldsToUnset } }
          : {}

      const options = { upsert: true, returnOriginal: false }
      const data = await getWordsCollection().findOneAndUpdate(
        { _id: new ObjectId(id) }, // query
        {
          $set: { ...fieldsToSet, ...setCreated, ...setUpdated },
          ...unsetObj
        }, // replacement object
        options
      )

      return data.value
    }
  }
}
