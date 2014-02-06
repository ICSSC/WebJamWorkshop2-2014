var url = require('url');
var fs = require('fs');
var datastore = require('./datastore');

var head = fs.readFileSync('html/head.html').toString();
var foot = fs.readFileSync('html/foot.html').toString();



// Handle a css or js file
function handleCssJs(pathname, callback) {
  if (pathname.indexOf('css') == 0) {
    return readFileDirectPath(pathname, 'text/css', callback);
  } else if (pathname.indexOf('js') == 0) {
    return readFileDirectPath(pathname, 'text/javascript', callback);
  }
  return throw404(callback);
}



// Handle an html file
function handleHtml(pathname, vars, callback) {
  readFileDirectPath(pathname, 'text/html', function(contentType, data, statusCode) {
    // Already handled by throw404
    if (statusCode == 404) { return callback(contentType, data, statusCode); }
    
    
    var data = head + data + foot;
    for (var key in vars) {
      data = data.replace(new RegExp('\\{\\{' + key + '\\}\\}', 'g'), vars[key]);
    }
    callback(contentType, data, statusCode);
  });
}



// Read a file from the given path, and callback with content type
function readFileDirectPath(path, contentType, callback) {
  fs.readFile(path, function(err, data) {
    if (err) {
      throw404(callback);
      return;
    }
    callback(contentType, data.toString(), 200);
  });
}



// return the 404 not found page
function throw404(callback) {
  fs.readFile('html/err.html', function(err, data) {
    var content = head + data.toString() + foot;
    callback('text/html', content.replace(/\{\{title\}\}/g, '404 Not Found'), 404);
  });
}

// public route function
exports.handleHtml = handleHtml;
exports.handleCssJs = handleCssJs;
exports.throw404 = throw404;