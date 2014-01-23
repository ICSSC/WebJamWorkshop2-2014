// require(...) imports modules to use
// java equivalent: import ...;
var http = require('http');
var url = require('url');
var typerouter = require('./typerouter');
var queryhandler = require('./queryhandler');


// Create a server that responds to a request, req
// with the given function, sending a response, resp
var server = http.createServer(function(req, resp) {
  // Parse the url path into a JSON object
  var urlData = url.parse(req.url, true);

  if (queryhandler.handleQuery(urlData, resp)) {
    return;
  }

  typerouter.route(urlData, function(data) {
    resp.writeHead(data.code, {'Content-Type': data.contentType});
    resp.end(data.content);
  });
});

// Start server, listening on either the port specified (when deployed)
// or, if not specified, on port 8080
server.listen(process.env.PORT || 8080);
