var express = require('express');
var typerouter = require('./typerouter');
var datastore = require('./datastore');
var queryhandler = require('./queryhandler');

var app = express();
app.use(express.cookieParser());
app.use(express.cookieSession({ secret: 'superSecretKey' }));

// Index Page
app.get('/', function(req, resp) {
  typerouter.handleHtml('html/index.html', {
    'title': 'Index'
  }, writeResponse.bind(this, resp));
});



// Match /css/anything or /js/anything
app.get(/(\/css\/.+|\/js\/.+)/, function(req, resp) {
  var param = req.params[0];
  if (param) {
    typerouter.handleCssJs(param.substring(1), writeResponse.bind(this, resp));
  }
});



// Register page
app.get('/register', function(req, resp) {
  typerouter.handleHtml('html/register.html', {
    'title': 'Register'
  }, writeResponse.bind(this, resp));
});



// Login page
app.get('/login', function(req, resp) {
  typerouter.handleHtml('html/login.html', {
    'title': 'Login'
  }, writeResponse.bind(this, resp));
});



// User page
var quoteWindow = 
  '<div class="well window">'
+ '  <h3>Add a Quote</h3>'
+ '  <div class="input-group">'
+ '    <span class="input-group-addon">Quote</span>'
+ '    <input class="form-control" type="text" id="quote">'
+ '  </div><br>'
+ '  <div class="btn btn-primary" id="btn">Add Quote</div>'
+ '</div>';
var addQuoteScript = '<script type="text/javascript" src="/js/user.js"></script>';
app.get(/\/user\/(.+)/, function(req, resp) {
  var username = req.params[0];
  if (!username) {
    return typerouter.throw404(writeResponse.bind(this, resp));
  }
  datastore.getUser(username, function(user) {
    if (!user) {
      return typerouter.throw404(writeResponse.bind(this, resp));
    }
    var quotes = user.quotes;
    var str = '';
    for (var i = 0; i < quotes.length; i++) {
      str += '<div class="well">' + quotes[i] + '</div>';
    }
    var loggedIn = (req.session && req.session.username == username);
    typerouter.handleHtml('html/user.html', {
      'title': username,
      'username': username,
      'quotes': str,
      'addQuote': loggedIn ? quoteWindow : '',
      'addQuoteScript': loggedIn ? addQuoteScript : ''
    }, writeResponse.bind(this, resp));
  });
});



// Query
app.get('/query', function(req, resp) {
  queryhandler.handleQuery(req, resp);
});



// Default, throw 404
app.get(/.*/, function(req, resp) {
  return typerouter.throw404(writeResponse.bind(this, resp));
});

app.listen(8080);

function writeResponse(resp, contentType, data, statusCode) {
  resp.writeHead(statusCode, {'Content-Type': contentType});
  resp.end(data);
}