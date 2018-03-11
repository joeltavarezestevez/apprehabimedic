app.controller('SecuenciasDetalleCtrl', ['$scope', '$stateParams', '$window', '$timeout', '$state', 'Notification', 'secuenciasFac', function($scope, $stateParams, $window, $timeout, $state, Notification, secuenciasFac) {

    $scope.secuencia = {};

    secuenciasFac.get(parseInt($stateParams.id,10))
    .then(
        function(response){
            $scope.secuencia = response.data;
            $scope.secuencia.secuencia_actual = parseInt($scope.secuencia.secuencia_actual);
            $scope.secuencia.secuencia_limite = parseInt($scope.secuencia.secuencia_limite);
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );
    
    $scope.save = function() {
        $scope.secuencia.estado_id = 1;
        secuenciasFac.save($scope.secuencia)
        .then(
            function(response){
                console.log("Secuencia registrada!");
                console.log(response);
                console.log($scope.secuencia);
                $timeout(function() {
                    $state.go('app.configuracion-secuencias');
                    console.log("State Changed");
                    Notification({
                        message: 'Secuencia registrada correctamente!',
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
                console.log($scope.secuencia);
            }
        );
    }
    
    $scope.update = function() {
        secuenciasFac.update($scope.secuencia, parseInt($stateParams.id,10))
        .then(
            function(response){
                console.log("Secuencia actualizada!");
                console.log(response);
                console.log($scope.secuencia);
                $timeout(function() {
                    $state.go('app.configuracion-secuencias');
                    console.log("State Changed");
                    Notification({
                        message: 'Secuencia actualizada correctamente!',
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
                console.log($scope.secuencia);
            }
        );
    }
    
    $scope.back = function() {
        $window.history.back();
    }
}])
