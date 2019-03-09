export type SaveWordModel = {
  readonly _id?: string
  readonly value: string
  readonly translations: ReadonlyArray<string>
  readonly explanations: ReadonlyArray<string>
  readonly usages: ReadonlyArray<string>
}

export type ApiWordEntity = {
  readonly _id: string
  readonly value: string
  readonly translations?: ReadonlyArray<string>
  readonly explanations?: ReadonlyArray<string>
  readonly usages?: ReadonlyArray<string>
  readonly createdDate?: string
  readonly updatedDate?: string
}
