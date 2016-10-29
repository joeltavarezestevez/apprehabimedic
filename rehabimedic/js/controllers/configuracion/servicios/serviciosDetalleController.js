app.controller('ServiciosDetalleCtrl', ['$scope', '$stateParams', '$window', '$timeout', '$state', 'Notification', 'serviciosFac', function($scope, $stateParams, $window, $timeout, $state, Notification, serviciosFac) {

    $scope.servicio = {};

    serviciosFac.get(parseInt($stateParams.id,10))
    .then(
        function(response){
            $scope.servicio = response.data;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );
    
    $scope.save = function() {
        $scope.servicio.estado_id = 1;
        serviciosFac.save($scope.servicio)
        .then(
            function(response){
                console.log("Servicio registrado!");
                console.log(response);
                console.log($scope.servicio);
                $timeout(function() {
                    $state.go('app.configuracion-servicios');
                    console.log("State Changed");
                    Notification({
                        message: 'Producto registrado correctamente!',
                        title: 'Registro realizado',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'success');                    
                }, 1000, false);
            },
            function(response){
                console.log("Error");
                console.log(response);
                console.log($scope.servicio);
            }
        );
    }
    
    $scope.update = function() {
        serviciosFac.update($scope.servicio, parseInt($stateParams.id,10))
        .then(
            function(response){
                console.log("servicio actualizado!");
                console.log(response);
                console.log($scope.servicio);
                $timeout(function() {
                    $state.go('app.configuracion-servicios');
                    console.log("State Changed");
                    Notification({
                        message: 'Producto actualizado correctamente!',
                        title: 'Registro Actualizado',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'info');                    
                }, 1000, false);
            },
            function(response){
                console.log("Error");
                console.log(response);
                console.log($scope.servicio);
            }
        );
    }
    
    $scope.back = function() {
        $window.history.back();
    }
}])
