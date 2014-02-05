var http = require('http');
var typerouter = require('./typerouter');
var queryhandler = require('./queryhandler');

var server = http.createServer(function(req, resp) {
  if (queryhandler.handleQuery(req, resp)) {
    return;
  }
  typerouter.route(req, function(contentType, data, statusCode) {
    resp.writeHead(statusCode, {'Content-Type': contentType});
    resp.end(data);
  });
});

server.listen(8080);