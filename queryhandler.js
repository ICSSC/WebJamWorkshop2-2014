var datastore = require('./datastore');



// handle a query
function handleQuery(req, resp) {
  var query = req.query;
  var action = query.action;
  var username = query.name;
  // ensure that there is an action parameter
  if (!action) {
    return writeInvalid(resp);
  }
  // if we're adding a user, adding a quote, or getting a user
  if (action == 'addUser') {
    datastore.addUser(query.name, query.password, writeSuccess.bind(this, resp));
  } else if (action == 'addQuote') {
    datastore.addQuote(query.name, query.quote, writeSuccess.bind(this, resp));
  } else if (action == 'getUser') {
    // When we get the user, stringify the users quotes
    datastore.getUser(query.name, function(user) {
      if (!user) return writeInvalid(resp);
      resp.writeHead(200);
      resp.end(JSON.stringify(user.quotes));
    });
    
  // Get a user and check against the password
  } else if (action == 'login') {
    datastore.getUser(query.name, function(user) {
      var success = (user && user.password == query.password);
      
      // If the password is the same, set the session variable
      if (success) {
        req.session.username = query.name;
      }
      writeSuccess(resp, success);
    });
  } else {
    writeInvalid(resp);
  }
}



// Return a 400 Bad request
function writeInvalid(resp) {
  resp.writeHead(400);
  resp.end();
} 



// Return the success object
function writeSuccess(resp, success) {
  resp.writeHead(200);
  resp.end(JSON.stringify({'success': success}));
}

exports.handleQuery = handleQuery;