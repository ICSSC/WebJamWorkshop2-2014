var datastore = require('./datastore');

// Takes a parsed query and a serverresponse object
// returns true if it will handle the request
function handleQuery(queryData, resp) {
  var query = queryData.query;
  // If the request is to /query
  if (queryData.pathname.indexOf('/query') == 0) {
    // Get the action parameter, if it doesn't exist, return invalid
    var action = query.action;
    if (!query.action) {
      return writeInvalid(resp);
    }

    // Add user
    if (action == 'addUser' && query.name && query.pwd) {
      datastore.addUser(query.name, query.pwd, writeSuccess.bind(this, resp));

    // Add quote
    } else if (action == 'addQuote' && query.name && query.pwd
        && query.quote) {
      datastore.addQuote(query.name, query.pwd, query.quote,
          writeSuccess.bind(this, resp));

    // Get a user
    } else if (action == 'getUser' && query.name) {
      datastore.getUser(query.name, function(items) {
        // If the items list isn't empty
        if (!items || items.length < 0) {
          return writeInvalid(resp);
        }
        // Build a JSON array [item1, item2....]
        var response = '[';
        for (var i = 0; i < items[0].quotes.length; i++) {
          // wrap it in quotes
          // IMPORTANT, YOU SHOULD MAKE SURE TO PREVENT INJECTED HTML AND SCRIPTS
          response += '"' + items[0].quotes[i] + '"';
          if (i < items[0].quotes.length - 1) {
            response += ',';
          }
        }
        response += ']';
        resp.writeHead(200);
        resp.end(response);
      });
    }
    // Yes, we will handle it
    return true;
  }
  // No, not a query, we won't handle it
  return false;
}

// Writes a 400 error
function writeInvalid(resp) {
  resp.writeHead(400);
  resp.end();
  return true;
}

// Given a ServerResponse object and a boolean whether or not an action
// succeeded, write a response object.
function writeSuccess(resp, success) {
  resp.writeHead(200);
  resp.end('{"success":' + success + '}');
}

exports.handleQuery = handleQuery;
