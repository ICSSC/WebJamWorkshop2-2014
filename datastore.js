var mongourl = 'mongodb://heroku:95878a1b93af8aa866c21e2a3c48b106@troup.mongohq.com:10015/app21984665';
var mongoClient = require('mongodb').MongoClient;
var collectionName = 'users';

// callback(success)
function addUser(username, password, callback) {
  openCollection(function(db, collection) {
    // SELECT * FROM users WHERE name=username
    collection.find({'name': username }).toArray(function(err, items) {
      // If the user already exists, return failed
      if (items && items.length > 0) {
        db.close();
        return callback(false);
      }
      
      // insert a user with name=username, password=password,
      // and quotes as an empty array
      collection.insert(
          {'name': username, 'password': password, 'quotes':[]},
          {'safe': true}, 
          function(err, docs) {
            db.close();
            callback(true);
          });
    });
  });
}

// callback(success)
function addQuote(username, quote, callback) {
  openCollection(function(db, collection) {
    // SELECT quotes FROM users WHERE name=username
    // quotes.push(quote)
    // UPDATE users SET quotes=quotes WHERE name=username
    collection.findAndModify({'name': username},
      [['_id', 'asc']],
      {$push: {'quotes': quote}},
      {'safe': true},
      function(err, object) {
        db.close();
        if (err || !object) {
          return callback(false);
        }
        return callback(true);
      });
  });
}

// callback(user)
function getUser(username, callback) {
  openCollection(function(db, collection) {
    // SELECT * FROM users WHERE name=username
    collection.find({'name': username}).toArray(function(err, items) {
      db.close();
      if (err || !items) return callback(null);
      callback(items[0]);
    });
  });
}

// callback(db, collection)
function openCollection(callback) {
  mongoClient.connect(mongourl, function(err, db) {
    if (err) throw err;
    var collection = db.collection(collectionName);
    callback(db, collection);
  });
}

exports.addUser = addUser;
exports.addQuote = addQuote;
exports.getUser = getUser;