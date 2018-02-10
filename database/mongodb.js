const { ObjectId } = require('mongodb');
const { getReplacementFields } = require('./util');

module.exports = mPool => {
  const getWordsCollection = () => (mPool.collection('words'));

  return {
    getWord(wordId) {
      return getWordsCollection().findOne({ _id: new ObjectId(wordId) });
    },
    getWords({ page, itemsPerPage }) {
      const getPaginatedPromise = getWordsCollection()
        .find()
        .limit(itemsPerPage)
        .skip(page > 0 ? (page - 1) * itemsPerPage : 0)
        .toArray();

      const getTotalPromise = getWordsCollection().count();

      return Promise.all([getPaginatedPromise, getTotalPromise])
        .then((values) => ({
          words: values[0],
          total: values[1]
        }));
    },

    saveWord(word) {
      const date = new Date();
      const { _id, ...fieldsToSave } = word;

      const { fieldsToSet, fieldsToUnset } = getReplacementFields(fieldsToSave);

      const setCreated = !_id ? { createdDate: date } : {},
        setUpdated = { updatedDate: date };

      // if $unset is an empty object, mongo will throw an exception.
      const unsetObj = Object.keys(fieldsToUnset).length > 0 ? { $unset: {...fieldsToUnset } } : {};

      return getWordsCollection().findAndModify({ _id: new ObjectId(_id) }, // query
        [], // sort order
        { $set: {...fieldsToSet, ...setCreated, ...setUpdated }, ...unsetObj }, // replacement object
        { new: true, upsert: true } // options
      ).then(data => data.value);
    }
  };
};