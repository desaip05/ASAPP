var Factories = angular.module('asapp.factories', []);

Factories.factory('beforeUnload', function ($rootScope, $window) {
    // Events are broadcast outside the Scope Lifecycle
    
    $window.onbeforeunload = function (e) {
        $rootScope.$broadcast('onBeforeUnload');
        return "Your changes may not be saved.";
    };
    
    $window.onunload = function () {
        $rootScope.$broadcast('onUnload');
    };
    return {};
})

.factory('bkUserService', function($q, $http) {

	return {

		logout: function(){
			var request = {
				method: 'PUT',
				url: bkBaseUrl + 'user/logout',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				params: {
				},
				data: userInfo,
				timeout: 10000
			};

			var deferred = $q.defer();
			return $http(request).then(function(response) {
				deferred.resolve(response);
				return deferred.promise;
			}, function(error) {
				deferred.reject(error);
				return deferred.promise;
			});
		},

		testBackend: function(){
			var request = {
				method: 'GET',
				url: bkBaseUrl + 'test',
				params: {
				},
				timeout: 10000
			};

			var deferred = $q.defer();
			return $http(request).then(function(response) {
				deferred.resolve(response);
				return deferred.promise;
			}, function(error) {
				deferred.reject(error);
				return deferred.promise;
			});
		},

		checkIfUserExists: function(username){
			var request = {
				method: 'GET',
				url: bkBaseUrl + 'user/check',
				params: {
					username: username
				},
				timeout: 10000
			};

			var deferred = $q.defer();
			return $http(request).then(function(response) {
				// this header is only present after we have logged in successfully
				// console.log("Got users!");
				deferred.resolve(response);
				return deferred.promise;
			}, function(error) {
				deferred.reject(error);
				return deferred.promise;
			});
		},

		getUsers: function(userId){
			var request = {
				method: 'GET',
				url: bkBaseUrl + 'user/list',
				params: {
					userId: userId
				},
				timeout: 10000
			};

			var deferred = $q.defer();
			return $http(request).then(function(response) {
				// this header is only present after we have logged in successfully
				// console.log("Got users!");
				deferred.resolve(response);
				return deferred.promise;
			}, function(error) {
				deferred.reject(error);
				return deferred.promise;
			});
		},

		getUserInfo: function(userId){
			var request = {
				method: 'GET',
				url: bkBaseUrl + 'user',
				params: {
					userId: userId
				},
				timeout: 10000
			};

			var deferred = $q.defer();
			return $http(request).then(function(response) {
				// this header is only present after we have logged in successfully
				// console.log("Got user info!");
				deferred.resolve(response);
				return deferred.promise;
			}, function(error) {
				deferred.reject(error);
				return deferred.promise;
			});
		},

		createUser: function(userInfo) {
			var request = {
				method: 'POST',
				url: bkBaseUrl + 'user',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				data: userInfo,
				timeout: 10000
			};

			var deferred = $q.defer();
			return $http(request).then(function(response) {
				if (response.status == 201) {
					deferred.resolve(response);
				}
				return deferred.promise;
			}, function(error) {
				if (error.status == 409) {
					// console.log("User exists");
					deferred.resolve(error);
				} else {
					deferred.reject(error);
				}
				return deferred.promise;
			});
		}
	};
})

.factory('bkChatService', function($q, $http){
	return{

		saveChat: function(chat){
			var request = {
				method: 'POST',
				url: bkBaseUrl + 'chat',
				headers: {
					'Content-Type': 'application/json',
					// 'Accept': 'application/json'
				},
				data: chat,
				timeout: 10000
			};

			var deferred = $q.defer();
			return $http(request).then(function(response) {
				// this header is only present after we have logged in successfully
				// console.log("Message saved: " + response.data);
				deferred.resolve(response);
				return deferred.promise;
			}, function(error) {
				deferred.reject(error);
				return deferred.promise;
			});
		},

		getChatHistory: function(chatRoomId, userId){
			var request = {
				method: 'GET',
				url: bkBaseUrl + 'chat',
				headers: {
					'Accept': 'application/json'
				},
				params: {
					chatRoomId: chatRoomId,
					userId: userId
				},
				timeout: 10000
			};

			var deferred = $q.defer();
			return $http(request).then(function(response) {
				// this header is only present after we have logged in successfully
				// console.log("Got chat history");
				deferred.resolve(response);
				return deferred.promise;
			}, function(error) {
				deferred.reject(error);
				return deferred.promise;
			});
		}

	};
})


;