var MongoClient = require("mongodb").MongoClient;


var state = {
  client: null
};

/**
 * Crée une connection MongoDB
 */
exports.connect = function(url, done) {
  if (state.client) {
    return done();
  }

  MongoClient.connect(
    url,
    {
      useNewUrlParser: true
    },
    function(err, client) {
      if (err) {
        return done(err);
      }
      state.client = client;
      done();
    }
  );
};

/**
 * Retourne une référence à la base de données dont le nom est passé en argument
 */
exports.get = function(dbName) {
  return state.client.db(dbName);
};

/**
 * Ferme la connection MongoDB
 */
exports.close = function(done) {
  if (state.client) {
    state.client.close(function(err, result) {
      state.client = null;
      state.mode = null;
      if (err) {
        console.log("TCL: exports.close -> err", err);
        done(err);
      }
    });
  }
};
