app.controller('ReferidoresDetalleCtrl', ['$scope', '$stateParams', '$window', '$timeout', '$state', 'Notification', 'referidoresFac', function($scope, $stateParams, $window, $timeout, $state, Notification, referidoresFac) {

    $scope.referidor = {};

    referidoresFac.get(parseInt($stateParams.id,10))
    .then(
        function(response){
            $scope.referidor = response.data;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );
    
    $scope.save = function() {
        $scope.referidor.estado_id = 1;
        referidoresFac.save($scope.referidor)
        .then(
            function(response){
                console.log("referidor registrado!");
                console.log(response);
                console.log($scope.referidor);
                $timeout(function() {
                    $state.go('app.configuracion-referidores');
                    console.log("State Changed");
                    Notification({
                        message: 'Referidor registrado correctamente!',
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
                console.log($scope.referidor);
                $timeout(function() {
                    Notification({
                        message: 'Ha occurrido un error al intentar registrar el referidor: \n' + response.data,
                        title: 'Error',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'danger');                    
                }, 1000, false);				
            }
        );
    }
    
    $scope.update = function() {
        referidoresFac.update($scope.referidor, parseInt($stateParams.id,10))
        .then(
            function(response){
                console.log("referidor actualizado!");
                console.log(response);
                console.log($scope.referidor);
                $timeout(function() {
                    $state.go('app.configuracion-referidores');
                    console.log("State Changed");
                    Notification({
                        message: 'Referidor actualizado correctamente!',
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
                console.log($scope.referidor);
                $timeout(function() {
                    Notification({
                        message: 'Ha occurrido un error al intentar actualizar el referidor: \n' + response.data,
                        title: 'Error',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'danger');                    
                }, 1000, false);				
            }
        );
    }
    
    $scope.back = function() {
        $window.history.back();
    }
}])
