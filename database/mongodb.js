const { ObjectId } = require('mongodb');

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
      if (!word._id) {
        return getWordsCollection()
          .save(word)
          .then((response) => (response.ops[0]));
      }

      const wordId = word._id;
      delete word._id;

      return getWordsCollection()
        .findOneAndUpdate({ _id: new ObjectId(wordId) }, word)
        .then((resp) => (resp.value));
    }
  };
};