app.controller('UsuariosDetalleCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$filter' ,'$window', '$timeout', 'Notification', 'usuariosFac', 'perfilesUsuarios', function($scope, $rootScope, $state, $stateParams, $filter, $window, $timeout, Notification, usuariosFac, perfilesUsuarios) {
    
    $scope.perfilesUsuarios = perfilesUsuarios.data;
    $scope.usuario = {};
    
    $scope.closeAlert = function() {
        $scope.alert = false;
        console.log($scope.alert);
    }
    if ($stateParams.id) {
        usuariosFac.get(parseInt($stateParams.id,10))
        .then(
            function(response){
                $scope.usuario = response.data;
                console.log($scope.usuario);
            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
            }
        );          
    }
    
    $scope.save = function() {
        usuariosFac.save($scope.usuario)
        .then(
            function(response){
                console.log("usuario registrado!");
                console.log(response);
                console.log($scope.usuario);
                $timeout(function() {
                    $state.go('app.usuarios');
                    console.log("State Changed");
                    Notification({
                        message: 'Usuario registrado correctamente!',
                        title: 'Registro realizado',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'info');                    
                }, 1000, false);
            },
            function(response) {
                console.log("Error");
                console.log(response);
                console.log($scope.usuario);
                if(response.status == 400 && response.data.message){
                    Notification({
                        message: 'Errores al intentar crear el registro. Revise los mensajes arriba.',
                        title: 'Error',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'error');
                    console.log('Errol manin!');
                    $scope.alert = true;
                    $scope.mensajes = response.data.message;
                }
            }
        );
    }
    
    $scope.update = function() {
        $scope.usuario.persona_nombres = $scope.usuario.persona.persona_nombres;
        $scope.usuario.persona_apellidos = $scope.usuario.persona.persona_apellidos;
        $scope.usuario.persona_correo_electronico = $scope.usuario.persona.persona_correo_electronico;
        
        usuariosFac.update($scope.usuario, parseInt($stateParams.id,10))
        .then(
            function(response){
                console.log("usuario actualizado!");
                console.log(response);
                console.log($scope.usuario);
                $timeout(function() {
                    $state.go('app.usuarios');
                    console.log("State Changed");
                    Notification({
                        message: 'Usuario actualizado correctamente!',
                        title: 'Registro Actualizado',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'info');                    
                }, 1000, false);
            },
            function(response) {
                console.log("Error");
                console.log(response);
                console.log($scope.usuario);
                if(response.status == 400 && response.data.message){
                    Notification({
                        message: 'Errores al intentar actualizar el registro. Revise los mensajes arriba.',
                        title: 'Error',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'error');
                    console.log('Errol manin!');
                    $scope.alert = true;
                    $scope.mensajes = response.data.message;
                }
            }
        );
    }
    
    $scope.back = function() {
        $window.history.back();
    }
}])