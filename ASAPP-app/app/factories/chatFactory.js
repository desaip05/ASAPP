angular.module('asapp.factories')

.factory('Socket', function(socketFactory){
  // var myIoSocket = io.connect('http://chat.socket.io:80');
  var myIoSocket = io.connect(baseDomain + ':3000');
  mySocket = socketFactory({
    ioSocket: myIoSocket
  });
  return mySocket;
})


.factory('Chat', function(Socket, TimeService, Application){

  var username;
  var userId;
  var users = {};
  users.numUsers = 0;

  var messages = [];
  var TYPING_MSG = '. . .';

  var Notification = function(username,message){
    var notification          = {};
    notification.username     = username;
    notification.message      = message;
    notification.notification = true;
    return notification;
  };

  Socket.on('login', function (data) {
    // Users.setNumUsers(data);
  });

  Socket.on('new message', function(msg){
      addMessage(msg);
  });

  Socket.on('typing', function (data) {
    var typingMsg = {
      userId: data.userId,
      username: data.username,
      message: TYPING_MSG
    };
    addMessage(typingMsg);
  });

  Socket.on('stop typing', function (data) {
    removeTypingMessage(data.userId);
  });

  Socket.on('user joined', function (data) {
    var msg = data.username + ' online';
    var notification = new Notification(data.username,msg);
    // addMessage(notification);
    // Users.setNumUsers(data);
    // Users.addUsername(data.username);
  });

  Socket.on('user left', function (data) {
    var msg = data.username + ' offline';
    var notification = new Notification(data.username,msg);
    addMessage(notification);
    // Users.setNumUsers(data);
    // Users.deleteUsername(data.username);
  });

  var addMessage = function(msg){
    msg.notification = msg.notification || false;
    var currTime = new Date();
    var currTimeInMSec = currTime.getTime();
    msg.time = currTimeInMSec;
    msg.message = Application.decodeHtmlEntity(msg.message);
    messages.push(msg);
  };

  var removeTypingMessage = function(usrId){
    for (var i = messages.length - 1; i >= 0; i--) {
      if(messages[i].userId === usrId && messages[i].message.indexOf(TYPING_MSG) > -1){
        messages.splice(i, 1);
        scrollBottom();
        break;
      }
    }
  };

  return {
    getUser: function(){
      return {
        username: username,
        userId: userId
      };
    },
    setUser: function(usrName, usrId){
      username = usrName;
      userId = usrId;
    },
    getMessages: function() {
      return messages;
    },
    clearMessages: function(){
      messages = [];
    },
    sendMessage: function(msg, chatRoomId){
      var currTime = new Date();
      var currTimeInMSec = currTime.getTime();
      // console.log(currTimeInMSec);
      messages.push({
        userId: userId,
        username: username,
        message: msg,
        time: currTimeInMSec,
        notification: false
      });
      // Socket.emit('new message', msg);

      Socket.emit('new message', {
          room: chatRoomId,
          message: msg
      });
    },
    scrollBottom: function(){
      scrollBottom();
    }
  };
})
.factory('Application', function() {
  var activeUser = {
    id: 0,
    username: ""
  };

  return {
    setActiveUser: function(userInfo){
      activeUser = userInfo;
    },

    getActiveUser: function(){
      return activeUser;
    },

    decodeHtmlEntity: function(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
    },

    encodeHtmlEntity: function(str) {
      var buf = [];
      for (var i = str.length - 1; i >= 0; i--) {
        buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
      }
      return buf.join('');
    },

  };
})
;