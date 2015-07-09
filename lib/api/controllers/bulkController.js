var
  q = require('q');

module.exports = function BulkController (kuzzle) {

  this.import = function (data) {
    var deferred = q.defer();

    kuzzle.emit('data:bulkImport', data);

    deferred.resolve({});
    return deferred.promise;
  };

};