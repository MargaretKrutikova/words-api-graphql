import { ObjectId } from "mongodb"

export type WordDbModel = {
  readonly _id?: ObjectId
  readonly value: string
  readonly translations?: ReadonlyArray<string>
  readonly explanations?: ReadonlyArray<string>
  readonly usages?: ReadonlyArray<string>
  readonly createdDate: Date
  readonly updatedDate?: Date
}
