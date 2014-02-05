var url = require('url');
var fs = require('fs');
var datastore = require('./datastore');

var head = fs.readFileSync('html/head.html').toString();
var foot = fs.readFileSync('html/foot.html').toString();

// callback(contentType, data, statusCode);
function route(req, callback) {
  // parse the data like before
  var parsedData = url.parse(req.url);
  
  // trim off the '/' in the beginning
  var pathname = parsedData.pathname.substring(1); 
  
  // If a css file
  if (pathname.indexOf('css') == 0) {
    readFileDirectPath(pathname, 'text/css', callback);
    
  // If a js file
  } else if (pathname.indexOf('js') == 0) {
    readFileDirectPath(pathname, 'text/js', callback);
    
  // If an img file
  } else if (pathname.indexOf('img') == 0) {
    handleImage(pathname, callback);
    
  // else default to an html file
  } else {
    handleHtml(pathname, callback);
  }
}

function handleImage(pathname, callback) {
  // dictionary of file endings to content type
  var fileEndingMappings = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".ico": "image/x-icon"
  };
  
  // go through each supported ending and find the correct content type
  for (key in fileEndingMappings) {
    if (pathname.indexOf(key, pathname.length - 1 - key.length) != -1) {
      readFileDirectPath(path, fileEndingMappings[key], callback);
      return;
    }
  }
  throw404(callback);
}

function handleHtml(pathname, callback) {
  // If getting a user page
  if (pathname.indexOf('user') == 0) {
    // get the username
    var parts = pathname.split('/');
    var username = parts[parts.length - 1];
    
    // Read the file with custom callback
    readFileDirectPath('html/user.html', 'text/html',
      function(contentType, data, code) {
        // If error code
        if (code == 404) return callback(contentType, data, code);
        
        // Get the user
        datastore.getUser(username, function(user) {
          // If error, throw 404
          if (!user) return throw404(callback);
          
          // Build the quotes content
          var str = '';
          var row = '<div class="well">{{quote}}</div>';
          for (var i = 0; i < user.quotes.length; i++) {
            str += row.replace(/\{\{quote\}\}/g, user.quotes[i]);
          }
          var content = data.toString();
          
          // replace {{quotes}} and {{username}}
          content = content.replace(/\{\{quotes\}\}/g, str);
          content = content.replace(/\{\{username\}\}/g, user.name);
          
          // use callback
          callback(contentType, head + content + foot, code);
        });
      });
    return;
  }
  
  // else, read as normal
  readFileDirectPath('html/' + pathname + '.html', 'text/html',
      function(contentType, data, code) {
        callback(contentType, head + data + foot, code);
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
    callback('text/html', head + data.toString() + foot, 404);
  });
}

// public route function
exports.route = route;