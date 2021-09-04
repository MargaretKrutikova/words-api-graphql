const getObjectSubset = <T>(obj: T, keys: ReadonlyArray<keyof T>) =>
  Object.assign(
    {},
    ...keys.map(key => ({
      [key]: obj[key]
    }))
  );

// fields with undefined/null/empty string as values or empty arrays are unset from the mongodb
const shouldUnsetKey = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

const objectKeys = Object.keys as <T>(
  o: T
) => ReadonlyArray<Extract<keyof T, string>>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getReplacementFields = <T>(obj: T) => {
  const keys = objectKeys(obj);

  const keysToUnset = keys.filter(key => shouldUnsetKey(obj[key]));
  const keysToSet = keys.filter(key => !shouldUnsetKey(obj[key]));

  return {
    fieldsToSet: getObjectSubset(obj, keysToSet),
    fieldsToUnset: getObjectSubset(obj, keysToUnset)
  };
};
