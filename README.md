# ASAPP


## Database (MySQL)

Create a database with name `asapp` in your MySQL

Import the asapp.sql file 

## Backend Code (JAVA)

Use the war file to start the backend which contains REST api

```
$ cd ASAPP-Java
$ mvn clean install
```

## Chat Server

```
$ cd socket-chat-server
$ npm install
$ node server.js
```
Point your browser to `http://localhost:3000` to make sure it is running.


## Client Code (AngularJS)

```
$ cd ASAPP-app
$ npm start
```

Point your browser to `http://localhost:8000`.


### Notes: 
I have made sure the following requirements are met:

```
Your challenge is to design and implement a basic chat service that allows users to broadcast messages to each other in a shared chat room. It should include a server backed by a persistent data store and a web client.

Your server should support the following requests:

- Login User
Takes a username and, if the user doesn’t already exist it, saves it to the data store.

- Send Message
Takes a message and saves that to the data store. 

- Fetch Messages
Loads all messages. The server should also have the capability of loading only "new" messages, i.e. messages that a user hasn't seen yet. It's up to you how to support this.

Your client should support the following use cases:

- Login
Let’s a user login.

- Basic chat
After logging in, a user can send messages to the shared chat room. When a message is sent, it should show up in the windows of all the users who are logged in. Upon logging in, a user should also be able to see the older messages that were sent previously.

```

Please let me know if something does not seem to work.



