// Find the html components
var btn = document.getElementById('btn');
var pwd = document.getElementById('pwd');
var quote = document.getElementById('quote');
var alertWind = document.getElementById('alert');
var container = document.getElementById('quotes');

// When clicking the button
btn.onclick = function () {
  // make alert window invisible
  alertWind.style.display = 'none';

  // get the values from the two text inputs, make sure to hash the value
  // of password for security purposes
  var pwdStr = encodeURIComponent(CryptoJS.SHA256(pwd.value));
  var quoteStr = encodeURIComponent(quote.value);

  // Create a new XMLHttpRequest object to be used for
  // AJAX (Asynchronous Javascript and XML)
  var xhr = new XMLHttpRequest();

  // Open to prepare to send to /query
  xhr.open('GET', '/query?action=addQuote&password=' + pwdStr + '&quote='
    + quoteStr + '&name=' + name, true);
  // Callback for whent the query completes
  xhr.onreadystatechange = function() {
    // Only execute when readyState == 4 which means ready
    if (xhr.readyState == 4) {
      // Turn the response text into JSON
      var response = JSON.parse(xhr.responseText);

      // If successful, make another request to get the updated list of quotes
      if (response.success) {
        // Once again, prepare to send to /query
        xhr.open('GET', '/query?action=getUser&name=' + name, true);
        // Once again, set the callback function
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            // Parse the responsetext into a JSON array
            var quotes = JSON.parse(xhr.responseText);

            // Clear the container of all children
            while (container.firstChild) {
              container.removeChild(container.firstChild);
            }

            // For each quote, add it into the container
            for (var i = 0; i < quotes.length; i++) {
              var div = document.createElement('div');
              div.className = 'well';
              div.innerHTML = quotes[i];
              container.appendChild(div);
            }
          }
        }
        // Send another request
        xhr.send();
      } else {

        // If there was an error, show the alert
        alertWind.style.display = 'block';
      }
    }
  }
  // Send the request;
  xhr.send();
};
