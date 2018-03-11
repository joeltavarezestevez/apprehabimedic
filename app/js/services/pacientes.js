app.factory('pacientesFac', ['$http', 'BASEURL', function($http, BASEURL) {

    var urlBase = BASEURL + '/api/pacientes';
    
    return {
        
        someFields : function() {
            var promise = $http.get(urlBase + "/someFields");
            promise.success(function(data, status, headers, conf){
                return data;
            });
            return promise;
        },
        pacientesNombres : function() {
            var promise = $http.get(urlBase + "/pacientesNombres");
            promise.success(function(data, status, headers, conf){
                return data;
            });
            return promise;
        },
        all : function() {
            var promise = $http.get(urlBase);
            promise.success(function(data, status, headers, conf){
                return data;
            });
            return promise;
        },

        get : function(id) {
            return $http.get(urlBase + "/" + id);
        },        
        
        save : function(data) {
            return $http({
                method: 'POST',
                url: urlBase,
                headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                data: $.param(data)
            });
        },

        update : function(data, id) {
            return $http({
                method: 'PUT',
                url: urlBase + "/" + id,
                headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                data: $.param(data)
            });
        },
        
        delete : function(id) {
            return $http.delete(urlBase + "/" + id);
        }
    }
}]);