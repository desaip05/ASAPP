'use strict';



var baseDomain = "http://localhost";

var bkBaseUrl = baseDomain + ":8080/ASAPP-Java/rest/";

// Declare app level module which depends on views, and components
angular.module('asapp', [
  'ngRoute',
  'asapp.login',
  'asapp.chatWindow',
  'asapp.version',
  'asapp.services',
  'asapp.factories',
  'asapp.directives',
  'btford.socket-io',
  'angularMoment'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  	$locationProvider.hashPrefix('!');
	$routeProvider.otherwise({redirectTo: '/login'});
}])
.run(function($rootScope, $location, $window, bkUserService, Application, beforeUnload) {
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {
	  if (!$rootScope.userLoggedIn) {
	    // no logged user, redirect to /login
	    if ( next.templateUrl === "login.html") {
	    } else {
	      $location.path("/login");
	    }
	  }
	});


	$rootScope.$on('onBeforeUnload', function(e, confirmation) {
        // console.log('before leaving page'); 
        logout();
        e.preventDefault();
        return null;
    });

    $rootScope.$on('onUnload', function(e) {
        // console.log('leaving page'); 
        logout();
    });

    function logout(){
    	if ($rootScope.userLoggedIn) {
            var userInfo = Application.getActiveUser();
            // console.log("Logging out...");
            var userInfoJSON = angular.toJson(userInfo);
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("PUT", bkBaseUrl + "user/logout"); //the false is for making the call synchronous
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send(userInfoJSON);
        }
    }
})
;
