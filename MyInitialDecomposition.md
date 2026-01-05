###### Endpoints 

* GET /api/users/:id           # fetch details of a specific user
* POST /api/users              # create a new user
* PUT /api/users/:id           # update user details
* DELETE /api/users/delete/:id # remove a user

* GET /api/messages/:id        # fetch all sent/received messages for a user
* POST /api/messages           # send a new message
* PUT /api/messages/:id        # update message status (e.g., mark as read)
* DELETE /api/messages/:id     # delete a message

###### Database


USER


* ID                  INT
* Username            VARCHAR 
* Email               VARCHAR 


MESSAGE

* ID INT
* FromUID             INT, FOREIGN KEY 
* ToUID               INT, FOREIGN KEY
* MessageText         TEXT
* SentDt              DATETIME 
* ReadStatus          VARCHAR ('Read or Unread') 


###### User Authentication 

* PassportJS
* JWT Token 
