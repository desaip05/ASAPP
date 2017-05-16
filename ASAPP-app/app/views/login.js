'use strict';

angular.module('asapp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'views/login.html',
    controller: 'loginCtrl'
  });
}])

.controller('loginCtrl', function($rootScope, $scope, $location, bkUserService, Application, beforeUnload) {
	$rootScope.userLoggedIn = false;
	$scope.userInfo = {
		id: 0,
		username: ""
	};

	$scope.login = function(){
		var username = $scope.userInfo.username;
		// console.log("Username" + username);

		bkUserService.checkIfUserExists(username).then(function(response) {
	      $scope.userInfo.id = parseInt(response.data);
	      if(parseInt(response.data)===0){
	      	bkUserService.createUser($scope.userInfo).then(function(response) {
	      		$scope.userInfo.id = parseInt(response.data.id);
				if($scope.userInfo.id>0){
					$rootScope.userLoggedIn = true;
					Application.setActiveUser($scope.userInfo);
					$location.path('/chatWindow');
				}
		    }, function(error) {
		      console.error(error);
		      return error;
		    });
	      }
	      else{
	      	$rootScope.userLoggedIn = true;
	      	Application.setActiveUser($scope.userInfo);
	      	$location.path('/chatWindow');
	      }
	    }, function(error) {
	      console.error(error);
	      return error;
	    });


	 	// bkUserService.testBackend().then(function(response) {
	  //     console.log(response.data);
	  //   }, function(error) {
	  //     console.error(error);
	  //     return error;
	  //   });
	}
});