/* eslint-disable no-param-reassign */

const filterResults = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   */
  /**
   * Query for documents with filter
   * @param {Object} [filter] - Mongo filter
   * @returns {Promise<QueryResult>}
   */
  schema.statics.filter = async function (filter) {
    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter);
    docsPromise = docsPromise.exec();
    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const result = {
        results,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = filterResults;
