var datastore = require('./datastore');
var url = require('url');

// handle a query, returns true if the query is a valid query
function handleQuery(req, resp) {
  // parse the data like before
  var parsedData = url.parse(req.url, true);
  var query = parsedData.query;
  
  // if requesting the correct path
  if (parsedData.pathname.indexOf('/query') == 0) {
    var action = query.action;
    var username = query.name;
    // ensure that there is an action parameter
    if (!action) {
      return writeInvalid(resp);
    }
    
    // if we're adding a user, adding a quote, or getting a user, return success
    // else, return false
    if (action == 'addUser') {
      datastore.addUser(query.name, query.password, writeSuccess.bind(this, resp));
      return true;
    } else if (action == 'addQuote') {
      datastore.addQuote(query.name, query.password, query.quote, writeSuccess.bind(this, resp));
      return true;
    } else if (action == 'getUser') {
      // When we get the user, stringify the users quotes
      datastore.getUser(query.name, function(user) {
        if (!user) return writeInvalid(resp);
        resp.writeHead(200);
        resp.end(JSON.stringify(user.quotes));
      });
      return true;
    }
    return writeInvalid(resp);
  }
  return false;
}

// Return a 400 Bad request
function writeInvalid(resp) {
  resp.writeHead(400);
  resp.end();
  return false;
} 

// Return the success object
function writeSuccess(resp, success) {
  resp.writeHead(200);
  resp.end(JSON.stringify({'success': success}));
}

exports.handleQuery = handleQuery;