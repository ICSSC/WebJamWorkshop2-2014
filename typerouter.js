var url = require('url');
var fs = require('fs');
var datastore = require('./datastore');

// Pre load the header and footer, since we use it for every html file
var header = fs.readFileSync('html/head.html');
var footer = fs.readFileSync('html/foot.html');

// Input: clientrequest object, callback({
//   content: '<html>...</html>',
//   contentType: 'text/html',
//   code: 200
// })
function route(urlData, callback) {
  var pathname = urlData.pathname;

  // Based on the pathname, we'll decide what kind of content it is
  if (pathname.indexOf('/img') == 0) {
    getImagePath(pathname, callback);
  } else if (pathname.indexOf('/css') == 0) {
    directPath(pathname.substring(1), callback, 'text/css');
  } else if (pathname.indexOf('/js') == 0) {
    directPath(pathname.substring(1), callback, 'text/javascript');
  // If it doesn't have a pathname that falls into any category, assume
  // its an html page (queries have already been handled at this point)
  } else {
    getHtmlPath(pathname, callback);
  }
}

// png, jpeg, icon
function getImagePath(pathname, callback) {
  // return a direct mapping of the path, content type determines on file extension
  var contentTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon'
  };
  
  for (key in contentTypes) {
    if (pathname.indexOf(key, pathname.length - 1 - key.length) != -1) {
      directPath(pathname.substring(1), callback, contentTypes[key], true);
      return;
    }
  }
}

// Load a file located at the given path
// raw is optional, if it is there, we won't convert the data to a string
// before writing
function directPath(pathname, callback, contentType, raw) {
  // Read the given file
  fs.readFile(pathname, function(err, data) {
    // If there was an error (doesn't exist) write the 404 page
    if (err) {
      error(callback);
      return;
    }

    // Build the response object
    var resp = {
      'contentType': contentType,
      'code': 200
    };

    // If raw, just send data through
    if (raw) {
      resp['content'] = data;
    } else {
      // If not raw, then convert the data to a string. If its an html file,
      // attach the header and footer
      if (contentType == 'text/html') {
        resp['content'] = header + data.toString() + footer;
      } else {
        resp['content'] = data.toString();
      }
    }

    // Callback with data
    callback(resp);
  });
}

function getHtmlPath(pathname, callback) {
  // /user is special since there is a user name that follows /user/username
  // We have to add in special data into the page depending on the user
  if (pathname.indexOf('/user') == 0) {
    // Split the path to get the username
    var parts = pathname.split('/');
    // read the user.html file
    fs.readFile('html/user.html', function(err, data) {
      // If we can't find it (shouldn't happen) send 404
      if (err) {
        error(callback);
        return;
      }
      
      // Get the content and user name.
      // replace all {{username}} with the username
      var content = header + data.toString() + footer;
      var username = parts[parts.length - 1];
      content = content.replace(/\{\{username\}\}/g, username);
      
      // Load this user's data
      datastore.getUser(username, function(items) {
        // If we can't find the user, return 404
        if (!items || items.length < 1) {
          error(callback);
          return;
        }

        // If we found the user, build the quotes data
        var str = '';
        var quotes = items[0].quotes;
        for (var i = 0; i < quotes.length; i++) {
          str += '<div class="well">' + quotes[i] + '</div>';
        }
        
        // Replace all instances of {{quotes}} with the quotes markup data
        content = content.replace(/\{\{quotes\}\}/g, str);

        // Write the response object
        var resp = {
          'content': content,
          'Content-Type': 'text/html',
          'code': 200};
        callback(resp);
      });
    });
  } else {
    directPath('html' + pathname + '.html', callback, 'text/html');
  }
}

// Return a 404 page
function error(callback) {
  fs.readFile('html/err.html', function(err, data) {
    callback({
      'content': header + data.toString() + footer,
      'contentType': 'text/html',
      'code': 404
    });
  });
}

// route is public, all else is private
exports.route = route;
