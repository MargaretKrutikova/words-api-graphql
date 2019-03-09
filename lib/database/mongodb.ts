import { MongoClient, ObjectId } from "mongodb"
import { ApiWordEntity, SaveWordModel } from "../schema/types/WordModel"
import { getReplacementFields } from "./util"

type PaginatedWordsRequest = {
  readonly page: number
  readonly itemsPerPage: number
}

export default (mPool: MongoClient) => {
  const getWordsCollection = () => mPool.db().collection<ApiWordEntity>("words")

  return {
    getWord: (wordId: ObjectId) =>
      getWordsCollection().findOne({ _id: new ObjectId(wordId) }),

    getWords: async ({ page, itemsPerPage }: PaginatedWordsRequest) => {
      const getPaginatedPromise = getWordsCollection()
        .find()
        .limit(itemsPerPage)
        .skip(page > 0 ? (page - 1) * itemsPerPage : 0)
        .toArray()

      const getTotalPromise = getWordsCollection().count()

      const values = await Promise.all([getPaginatedPromise, getTotalPromise])
      return {
        words: values[0],
        total: values[1]
      }
    },

    saveWord: async (word: SaveWordModel) => {
      const date = new Date()
      const { _id, ...fieldsToSave } = word

      const { fieldsToSet, fieldsToUnset } = getReplacementFields(fieldsToSave)

      const setCreated = !_id ? { createdDate: date } : {}
      const setUpdated = { updatedDate: date }

      // if $unset is an empty object, mongo will throw an exception.
      const unsetObj =
        Object.keys(fieldsToUnset).length > 0
          ? { $unset: { ...fieldsToUnset } }
          : {}

      const options = { upsert: true, returnOriginal: false }
      const data = await getWordsCollection().findOneAndUpdate(
        { _id: new ObjectId(_id) }, // query
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
