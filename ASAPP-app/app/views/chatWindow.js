'use strict';

angular.module('asapp.chatWindow', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/chatWindow', {
    templateUrl: 'views/chatWindow.html',
    controller: 'chatWindowCtrl'
  });
}])

.controller('chatWindowCtrl', function($scope, $location, $timeout, bkUserService, Socket, Chat, Application, bkChatService, moment, TimeService) {

	  $scope.data = {};
  $scope.messages = [];

  //Dummy data

  // $scope.messages = [
  // {
  //   message: "Today",
  //   userId: 2,
  //   notification: true
  // }, {
  //   message: "sadsadasd asdd a dsasd asd asd asd sad asd",
  //   time: 1447883882649,
  //   userId: 2
  // }, {
  //   message: "asaaaaa",
  //   time: 1447883882649,
  //   userId: 2
  // },{
  //   message: "Yesterday",
  //   userId: 2,
  //   notification: true
  // }, {
  //   message: "sadsadasd",
  //   time: 1447883882649,
  //   userId: 2
  // }, {
  //   message: "asaaaaa",
  //   time: 1447883882649,
  //   userId: 1
  // }, {
  //   message: "sadsadasd",
  //   time: 1447883882649,
  //   userId: 2
  // }, {
  //   message: "asaaaaa",
  //   time: 1447883882649,
  //   userId: 1
  // }];

  

  $scope.data.message = "";
  var typing = false;
  var lastTypingTime;
  var TYPING_TIMER_LENGTH = 250;

  $scope.data.userId = 0;


  $scope.chatRoomId = 1;


	Socket.connect();
	Socket.emit('subscribe', $scope.chatRoomId);
	$scope.messages = Chat.getMessages();

	$timeout(function(){
                $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
            }, 200);

  $scope.getTimeStr = function(currTime){
    var timeStr = moment(currTime).format('hh:mm a');
    return timeStr;
  };

  function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
  }

  function decode_utf8(s) {
    return decodeURIComponent(escape(s));
  }

  Socket.on('connect', function() {
    if (!$scope.data.username) {
      	var activeUser = Application.getActiveUser();
        var username = activeUser.username;
        var userId = parseInt(activeUser.id);
        $scope.data.username = username;
        $scope.data.userId = userId;
        // Socket.emit('subscribe', chatRoomId);
        Socket.emit('add user', {
          room: $scope.chatRoomId,
          username: username,
          userId: userId
        });
        Chat.setUser(username, userId);
        // $scope.data.message = "@" + $stateParams.username;
        document.getElementById("msg-input").focus();

      bkChatService.getChatHistory($scope.chatRoomId, $scope.data.userId).then(function(response) {
        var chatArray = response.data;
        var timeStr = "";
        var prevTimeStr = "";
        angular.forEach(chatArray, function(chatObj) {
          timeStr = TimeService.getRelativeTime(chatObj.messageTime, true);
          if(prevTimeStr==="" || prevTimeStr!==timeStr){
            //To indicate date of messages
            $scope.messages.push({
              userId: chatObj.fromUser,
              username: chatObj.fromUsername,
              message: timeStr,
              time: chatObj.messageTime,
              notification: true
            });
            prevTimeStr = timeStr;
          }
          // console.log(chatObj.message);
          chatObj.message = Application.decodeHtmlEntity(chatObj.message);
          $scope.messages.push({
            userId: chatObj.fromUser,
          	username: chatObj.fromUsername,
            message: chatObj.message,
            time: chatObj.messageTime,
            notification: false
          });
        });

        //If no message was sent today
        if(prevTimeStr!=="Today"){
          prevTimeStr="Today";
        	var chatObj = {};
          $scope.messages.push({
              userId: chatObj.fromUser,
              username: chatObj.fromUsername,
              message: prevTimeStr,
              time: chatObj.messageTime,
              notification: true
            });
        }
      }, function(error) {
        $window.alert({
          title: "Messaging failed!",
          content: error
        });
      });
    }
  });

  Socket.on("disconnect", function() {
    // console.log("client disconnected from server");
  });


  var sendUpdateTyping = function() {
    if (!typing) {
      typing = true;
      Socket.emit('typing', {
        room: $scope.chatRoomId
      });
    }
    lastTypingTime = (new Date()).getTime();
    $timeout(function() {
      var typingTimer = (new Date()).getTime();
      var timeDiff = typingTimer - lastTypingTime;
      if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
        Socket.emit('stop typing', {
          room: $scope.chatRoomId
        });
        typing = false;
      }
    }, TYPING_TIMER_LENGTH);
  };

  $scope.updateTyping = function() {
    // sendUpdateTyping();
  };

  $scope.messageIsMine = function(userId) {
    return $scope.data.userId === userId;
  };

  $scope.getBubbleClass = function(userId) {
    var classname = 'from-them';
    if ($scope.messageIsMine(userId)) {
      classname = 'from-me';
    }
    return classname;
  };

	$scope.getBubbleClassFrom = function(userId) {
    var classname = 'messageUsernameFromThem';
    if ($scope.messageIsMine(userId)) {
      classname = 'messageUsernameFromMe';
    }
    return classname;
  };

  $scope.getBubbleClassText = function(userId) {
    var classname = 'messageTextFromThem';
    if ($scope.messageIsMine(userId)) {
      classname = 'messageTextFromMe';
    }
    return classname;
  };

  $scope.getBubbleClassTime = function(userId) {
    var classname = 'messageTimeFromThem';
    if ($scope.messageIsMine(userId)) {
      classname = 'messageTimeFromMe';
    }
    return classname;
  };

  $scope.sendMessage = function(msg, chatRoomId) {
    var encodedMsg = Application.encodeHtmlEntity(msg);
	bkChatService.saveChat({
		chatRoomId: chatRoomId,
		message: encodedMsg,
		fromUser: $scope.data.userId
	}).then(function(response) {
		Chat.sendMessage(msg, chatRoomId);
		$scope.data.message = "";
	}, function(error) {
		console.error("Chat cannot be sent to the server");
	});
  };

});
