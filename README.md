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