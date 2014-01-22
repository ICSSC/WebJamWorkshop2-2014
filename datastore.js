var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://heroku:12a12c18b0d60c9942137d8662e9ba3a@linus.mongohq.com:10022/app21449155';
var collectionName = 'users';

// Add a user
function addUser(username, pwd, callback) {
  openCollection(function(db, collection) {
    // First, look to see if a user with the same name already exists
    collection.find({'name': username}).toArray(function(err, items) {
      // If it does, return add failed
      if (items && items.length > 0) {
        callback(false);
      } else {
        // If the user doesn't exist, add it
        collection.insert(
            {'name': username, 'pwd': pwd, 'quotes':[]},
            {'safe': true},
            function(err, docs) {
          callback(true);
        });
      }
      // Make sure to close the database
      db.close();
    });
  });
}

// Add a quote
function addQuote(username, pwd, quote, callback) {
  openCollection(function(db, collection) {
    // Find a user that matches the name and password,
    // when you find one, push the quote into the quotes array
    // of the first user you find
    collection.findAndModify(
        {'name': username, 'pwd': pwd},
        [['_id', 'asc']],
        {$push: {'quotes': quote}},
        {'safe': true},
        function(err, object) {
          // If there was an error or object is empty
          // (There is no user with same name and password) return failed
          if (err || !object) {
            callback(false);
          } else {
           callback(true);
          }
          // Make sure to close the database
          db.close();
        });
  });
}

// Get a user
function getUser(username, callback) {
  openCollection(function(db, collection) {
    // Return an array of users with the same name, should be at max, 1
    collection.find({'name': username}).toArray(function(err, items) {
      callback(items);
      // Make sure to close the database
      db.close();
    });
  });
}

// Helper function to open a connection, remember to always close it!
function openCollection(callback) {
  mongoClient.connect(url, function(err, db) {
    if (err) throw err;

    var collection = db.collection(collectionName);
    callback(db, collection);
  });
}

exports.addUser = addUser;
exports.addQuote = addQuote;
exports.getUser = getUser;
