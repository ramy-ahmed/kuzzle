var
  should = require('should'),
  start = require('root-require')('lib/api/start');

require('should-promised');

describe('Test addSubscription function in hotelClerk controller', function () {

  var
    kuzzle,
    roomId,
    connection = {id: 'connectionid'},
    roomName = 'roomName',
    collection = 'user',
    filter = {
      term: {
        firstName: 'Ada'
      }
    };


  beforeEach(function () {
    kuzzle = {
      log: {
        debug: function() {},
        silly: function() {},
        error: function() {}
      },
      start: start
    };

    kuzzle.start({}, {workers: false, servers: false});
  });

  it('should has object filtersTree, customers and rooms empty', function () {
    should(kuzzle.dsl.filtersTree).be.an.object;
    should(kuzzle.dsl.filtersTree).be.empty;

    should(kuzzle.dsl.rooms).be.an.object;
    should(kuzzle.dsl.rooms).be.empty;

    should(kuzzle.dsl.customers).be.an.object;
    should(kuzzle.dsl.customers).be.empty;
  });

  it('should has the new room and customer', function () {
    return kuzzle.hotelClerk.addSubscription(connection, roomName, collection, filter)
      .then(function (result) {
        should(kuzzle.dsl.filtersTree).be.an.object;
        should(kuzzle.dsl.filtersTree).not.be.empty;

        should(kuzzle.hotelClerk.rooms).be.an.object;
        should(kuzzle.hotelClerk.rooms).not.be.empty;

        should(kuzzle.hotelClerk.customers).be.an.object;
        should(kuzzle.hotelClerk.customers).not.be.empty;

        should(result).be.an.object;
        should(result.data).be.a.String;
        should(result).not.be.an.object;
        should(kuzzle.hotelClerk.rooms[result.data]).be.an.object;
        should(kuzzle.hotelClerk.rooms[result.data]).not.be.empty;

        roomId = kuzzle.hotelClerk.rooms[result.data].id;

        should(kuzzle.hotelClerk.customers[connection.id]).be.an.object;
        should(kuzzle.hotelClerk.customers[connection.id]).not.be.empty;
        should(kuzzle.hotelClerk.customers[connection.id][roomName]).be.exactly(roomId);
      });
  });

  it('should return an error when the user has already subscribe to the filter', function () {
    return kuzzle.hotelClerk.addSubscription(connection, roomName, collection, filter)
      .then(function () {
        return should(kuzzle.hotelClerk.addSubscription(connection, roomName, collection, filter)).be.rejected;
      });
  });


});