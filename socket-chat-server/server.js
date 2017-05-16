var app   = require('express')();
var http  = require('http').Server(app);
var io    = require('socket.io')(http);

var port  = process.env.PORT || 3000;

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET");
  next();
});

app.get('/', function(req, res){
  res.send('welcome to asapp chat server');
});

// usernames which are currently connected to the chat
var usernames = {};
var userIds = {};

var users = {};
var sockets = {};


/********Private chat*************/

// socket.on('subscribe', function(room) {
//     console.log('joining room', room);
//     socket.join(room);
// });




io.on('connection', function (socket) {
  var addedUser = false;

  socket.on('subscribe', function(room) {
      // console.log('joining room', room);
      socket.join(room);
  });

  // socket.on('new message', function (data) {
  //   socket.broadcast.emit('new message', {
  //     username: socket.username,
  //     message: data
  //   });
  // });

  socket.on('new message', function(data) {
      console.log('sending room post', data.room);
      socket.broadcast.to(data.room).emit('new message', {
          username: socket.username,
          userId: socket.userId,
          message: data.message
      });
  });


  socket.on('add user', function (data) {
    // we store the username in the socket session for this client
    socket.username = data.username;
    socket.userId = data.userId;
    // add the client's username to the global list
    usernames[data.username] = data.username;
    userIds[data.userId] = data.userId;
    addedUser = true;
    // echo globally (all clients) that a person has connected
    socket.broadcast.to(data.room).emit('user joined', {
      username: socket.username,
      userId: socket.userId
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function (data) {
    socket.broadcast.to(data.room).emit('typing', {
      username: socket.username,
      userId: socket.userId
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function (data) {
    socket.broadcast.to(data.room).emit('stop typing', {
      username: socket.username,
      userId: socket.userId
    });
  });

  socket.on('disconnect', function (data) {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      delete userIds[socket.userId];
      // echo globally that this client has left
      socket.broadcast.to(data.room).emit('user left', {
        username: socket.username,
        userId: socket.userId
      });
    }
  });

});

app.get('/usernames', function(req, res){
  res.send(usernames);
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});