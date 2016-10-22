app.factory('menuFac', ['$http', '$rootScope', 'Auth','BASEURL', function($http, $rootScope, Auth, BASEURL) {

    var urlBase = BASEURL + '/api/menu';
    
    return {
        all : function() {
            var opciones = [];
            var promise = $http.get(urlBase);
            return promise.then(
                function(data){
                    if (Auth.isLoggedIn()) {
                        Auth.getLoggedInUser();
                        $rootScope.perfil_usuario = $rootScope.user.perfil_usuario_id;
                    }
                    
                    for(var i = 0; i < data.data.length; i++){
                        if($rootScope.perfil_usuario == 1) {
                            console.log('admin');
                            opciones.push(data.data[i]);
                        }
                        else if ($rootScope.perfil_usuario == 3) {
                            console.log('doctor');
                            if(data.data[i].opcion_menu_titulo != "Inicio" &&
                                data.data[i].opcion_menu_titulo != "Facturacion" &&
                                data.data[i].opcion_menu_titulo != "Reportes" &&
                                data.data[i].opcion_menu_titulo != "Usuarios" &&
                               data.data[i].opcion_menu_titulo != "Pagos" &&
                                data.data[i].opcion_menu_titulo != "Aseguradoras" &&
                                data.data[i].opcion_menu_titulo != "Personal Medico" &&
                                data.data[i].opcion_menu_titulo != "Configuracion") {

                                opciones.push(data.data[i]);
                            }                    
                        }
                        else if ($rootScope.perfil_usuario == 2) {
                            console.log('cajero');
                            if( data.data[i].opcion_menu_titulo != "Inicio" &&
                                data.data[i].opcion_menu_titulo != "Reportes" &&
                                data.data[i].opcion_menu_titulo != "Terapias" &&
                                data.data[i].opcion_menu_titulo != "Consultas" &&
                                data.data[i].opcion_menu_titulo != "Usuarios" &&
                                data.data[i].opcion_menu_titulo != "Configuracion") {

                                opciones.push(data.data[i]);
                                console.log(opciones);
                            }
                        }
                        else if ($rootScope.perfil_usuario == 4) {
                            console.log('terapista');
                            if( data.data[i].opcion_menu_titulo != "Inicio" &&
                                data.data[i].opcion_menu_titulo != "Consultas" &&                       
                                data.data[i].opcion_menu_titulo != "Reportes" &&
                                data.data[i].opcion_menu_titulo != "Usuarios" &&
                                data.data[i].opcion_menu_titulo != "Facturacion" &&
                               data.data[i].opcion_menu_titulo != "Pagos" &&
                                data.data[i].opcion_menu_titulo != "Aseguradoras" &&
                                data.data[i].opcion_menu_titulo != "Configuracion") {

                                opciones.push(data.data[i]);
                            }
                        }                
                    }
                    return opciones;                    
                })
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