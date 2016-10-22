app.factory('Auth', function ($rootScope, $window, $http, BASEURL) {
    
    var urlBase = BASEURL + '/api/authenticate';
    
  return {
    login: function (user) {
        return $http({
            method: 'POST',
            url: urlBase,
            headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(user)
        });
      // call the server side login restful api
//      $http.post('api/login', user).success(function(user) {
//        this.setLoggedInUser(user);
//        successHandler(user);
//      }).error(errorHandler);
    },
    getLoggedInUser: function () {
      if ($rootScope.user === undefined || $rootScope.user == null) {
        var userStr = $window.sessionStorage.getItem('user');
        if (userStr) {
          $rootScope.user = angular.fromJson(userStr);
        }
      }
      return $rootScope.user;
    },
    isLoggedIn: function () {
      return this.getLoggedInUser() != null;
    },
    setLoggedInUser: function (user) {
      $rootScope.user = user;
      if (user == null) {
        $window.sessionStorage.removeItem('user');
      } else {
        $window.sessionStorage.setItem('user', angular.toJson($rootScope.user));
      }
    }
  };
})