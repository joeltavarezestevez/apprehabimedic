app.factory('doctoresFac', ['$http', 'BASEURL', function($http, BASEURL) {
    
    var urlBase = BASEURL + '/api/doctores';
    //var urlBase = 'data/hos-doctors.json';
    
    return {
        
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

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
       var fd = new FormData();
       fd.append('file', file);

       $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
       })

       .success(function(response){
           console.log(response);
       })

       .error(function(){
       });
    }
 }]);