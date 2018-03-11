app.factory('getRNCFac', ['$http', 'BASEURL', function($http, BASEURL) {
    
    var urlBase = '//api.marcos.do/rnc';
    var urlBase = BASEURL + '/api/rnc';
    
    return {
        get : function(rnc) {
            var url = urlBase + "/" + rnc;
            console.log(url);
            return $http.get(url);
        }      
    }
}]);