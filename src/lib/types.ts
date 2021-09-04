import { ObjectId } from "mongodb";

type WordProperties = {
  readonly value: string;
  readonly translations?: ReadonlyArray<string>;
  readonly explanations?: ReadonlyArray<string>;
  readonly tags?: ReadonlyArray<string>;
  readonly usages?: ReadonlyArray<string>;
};

export type WordDbModel = {
  readonly _id?: ObjectId;

  readonly createdDate: Date;
  readonly updatedDate?: Date;
} & WordProperties;

export type WordMutationModel = {
  readonly id?: string;
} & WordProperties;

export type ApiWordEntity = {
  readonly id: string;
  readonly createdDate: string;
  readonly updatedDate?: string;
} & WordProperties;
