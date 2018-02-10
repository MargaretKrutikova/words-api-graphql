const getObjectSubset = (obj, keys) => {
  return Object.assign({}, ...keys.map(key => ({
    [key]: obj[key]
  })));
};

// fields with undefined/null/empty string as values or empty arrays are unset from the mongodb
const shouldUnsetKey = (value) => {
  return value == undefined || value === '' || (Array.isArray(value) && value.length === 0);
};

const getReplacementFields = (obj) => {
  const keys = Object.keys(obj);

  const keysToUnset = keys.filter(key => shouldUnsetKey(obj[key]));
  const keysToSet = keys.filter(key => !shouldUnsetKey(obj[key]));

  return { fieldsToSet: getObjectSubset(obj, keysToSet), fieldsToUnset: getObjectSubset(obj, keysToUnset) };
};

module.exports = {
  getReplacementFields: getReplacementFields
};