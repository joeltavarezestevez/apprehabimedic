app.factory('getRNCFac', ['$http', function($http) {
    
    var urlBase = 'http://api.marcos.do/rnc';
    
    return {
        get : function(rnc) {
            var url = urlBase + "/" + rnc;
            console.log(url);
            return $http.get(url);
        }      
    }
}]);  