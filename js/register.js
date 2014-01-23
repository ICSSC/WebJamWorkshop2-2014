// Find contents from html
var button = document.getElementById('btn');
var username = document.getElementById('username');
var password = document.getElementById('pwd');
var alertWind = document.getElementById('alert');

// When clicking the button
btn.onclick = function () {
  // make alert window invisible
  alertWind.style.display = 'none';

  // get the values from the two text inputs, make sure to hash the value
  // of password for security purposes
  var name = encodeURIComponent(username.value);
  var pwd = encodeURIComponent(CryptoJS.SHA256(password.value));
  
  // Create a new XMLHttpRequest object to be used for
  // AJAX (Asynchronous Javascript and XML)
  var xhr = new XMLHttpRequest();
  
  // Open to prepare to send to /query
  xhr.open('GET', '/query?action=addUser&name=' + name + '&pwd=' + pwd, false);
  // Callback for whent the query completes
  xhr.onreadystatechange = function() {
    // Only execute when readyState == 4 which means ready
    if (xhr.readyState == 4) {
      // Turn the response text into JSON
      var response = JSON.parse(xhr.responseText);
      
      // If successful, go to the user page
      if (response.success) {
        window.location.href = 'user/' + username.value;
        
      // If not successful, show the error
      } else {
        alertWind.style.display = 'block';
      }
    }
  };
  // Send the request;
  xhr.send();
};
