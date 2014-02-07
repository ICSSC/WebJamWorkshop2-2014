README
======

Somethings not covered in the workshop due to lack of time:
-----------------------------------------------------------

- Pushing to Heroku servers:
  - after making our changes, we want to send our code to heroku's servers.
    to do this, we navigate to our code directory and type the following commands
    in our command prompt or terminal
    
        git add .
        git commit -m "your message goes here"
        git push heroku master
    
    After doing so, a lot of text should stream by, finally ending with your app
    being deployed to heroku's server. If you get a message saying you don't have
    access to push to heroku's server, you may want to see this page to manage your
    keys:
    
    https://devcenter.heroku.com/articles/keys
    
    Note, this probably will happen the first time using heroku/git
    
- Heroku Ports:
  - In our example, we've been using a hard coded port 8080; however, heroku doesn't
    necessarily allow us to use port 8080. In fact, they port we are supposed to use
    is defined in a variable accessible by:
    
        process.env.PORT
    
    If there are issues with the deployed web app, fixing:
    
        server.listen(8080);
    
    to:
    
        server.listen(process.env.PORT || 8080);
    
    may very well fix the error. However, be wary that if process.env.PORT is defined on
    your local computer, as it was for mine, then your server will try to listen onto
    that port, rather than on 8080.
    
- Dynos:
  - From what I can tell, dynos correlate to how may instances of your server are allowed
    to run. You need at least one, but can have many, though more than one will cost money.
    When your app has been deployed, make sure that 1 dyno is running, if there are zero,
    you can modify it in your app dashboard.
    
Some Javascript things I used that I didn't mention or go into depth about:
---------------------------------------------------------------------------

- Binding:
  - This is used in the coding examples, for example, lets say you have two functions:
        function example(a, b, c, d) { ... }
    Let's say that we want to pass example as a callback, where the callback function format is this:
        function callback(b, c, d) { ... }
    Let's also say that when we pass our example function into the callback, we know exactly what a is.
    In this case, we can "bind" the value of a to our example function to generate a new function that only
    takes the remaining parameters. Remember, functions in javascript are just objects, they also have methods!
        
        // Code block
        {
          var a = 'Set value';
          // newExample(b, c, d)
          var newExample = example.bind(this, a);
          // Pass back a new function where the parameter counts match
          setCallback(newExample);
        }
    We use this as a shorthand in place of the more familiar:
        
        // Code block
        {
          setCallback(function newExample(b, c, d) {
            example(a, b, c, d);
          });
        }
    Both ways really work, just the bind function allows us to remove an anonymous function, making the code
    look little bit cleaner.
    
- Regex:
  - We used regex for matching strings. A regex string is a string that is formatted in such a way so that a
    special regex parser can use it as a pattern to match against other strings. Going through the examples that
    show up in the code:

        /..../
    Anything that shows up between two slashes is considered regex. For example when:
    
        /hello/
    is tested against any string, it will only match the string 'hello'. However, something like this:
    
        /hello|hi/
    will match either the string 'hello' or the string 'hi'. the '|' character divides what's to the left of it
    and the right of it into two sections. Either section can match, though 'hellohi' or 'hello|hi' won't match.
    Optionally, you can also put a g after the regex to indicate that the regex should find all occurances, rather than
    simply the first one.
    
        /h/
        /h/g
    When compared to the string 'hi hello', the first regex will only match the 'h' in 'hi' while the second will match both 'h's.
    
    
    
    The '.' character is special in regex. It stands for any character. A simple regex:
    
        /./ 
    will match any single character. 'a', 'b', '1', 'A', '.', '_', '-', all match, but anything that isn't
    exactly one character, 'aa', won't match.
    If any character is postfixed by a '+' or a '*' character, the previous character is
    allowed to repeat either 1 or more times (for the '+') or 0 or more times (for the '*'). This means that the regex:
    
        /.*/
    will match any and all strings, while these regexes:
    
        /.+/
        /h.*/
    will only match any non-empty string (size > 0) and any string whose first character is 'h' respectively.
    
    
    
    These two regexes:
    
        /abc(.*)def/
        /abc.*def/
    will match exactly the same strings. The difference, that the first one has a parenthesis around the '.*' segment, simply
    allows us to retrieve what matches that segment later. It essentially tells the regex engine, "Save what matches inside the parenthesis
    as the first group". for the first regex testing against 'abchello worlddef', 'hello world' will be the value of the first group. 
    
    
    
    Lastly, we introduced a lot of regexes, including a lot of special characters, what if we wanted to actually match a '. or a '/'? We prefix
    the special character with the '\' to tell regex that the character isn't inteded to be used as a special character. So:
    
        /./
        /\./
    The first character will match any character while the second one will only match the '.' character. What if we actually wanted to match the '\.' sequence?
    Like all other characters, simply prefixing a '\' in front of the '\' character will convert it to a normal character. So if we do this:
    
        /\\\./
    It will match '\.' while this:
    
        /\\./
    Will match any two character sequence where the first character is a '\'.
    
    
    
    
    
    
    
    