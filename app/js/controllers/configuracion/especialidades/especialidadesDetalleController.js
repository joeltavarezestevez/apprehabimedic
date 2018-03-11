app.controller('EspecialidadesDetalleCtrl', ['$scope', '$stateParams', '$window', '$timeout', '$state', 'Notification', 'especialidadesFac', function($scope, $stateParams, $window, $timeout, $state, Notification, especialidadesFac) {

    $scope.especialidad = {};

    especialidadesFac.get(parseInt($stateParams.id,10))
    .then(
        function(response){
            $scope.especialidad = response.data;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );
    
    $scope.save = function() {
        $scope.especialidad.estado_id = 1;
        especialidadesFac.save($scope.especialidad)
        .then(
            function(response){
                console.log("especialidad registrada!");
                console.log(response);
                console.log($scope.especialidad);
                $timeout(function() {
                    $state.go('app.configuracion-especialidades');
                    console.log("State Changed");
                    Notification({
                        message: 'Especialidad registrada correctamente!',
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
                console.log($scope.especialidad);
            }
        );
    }
    
    $scope.update = function() {
        especialidadesFac.update($scope.especialidad, parseInt($stateParams.id,10))
        .then(
            function(response){
                console.log("especialidad actualizada!");
                console.log(response);
                console.log($scope.enfermedad);
                $timeout(function() {
                    $state.go('app.configuracion-especialidades');
                    console.log("State Changed");
                    Notification({
                        message: 'Especialidad actualizada correctamente!',
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
                console.log($scope.especialidad);
            }
        );
    }
    
    $scope.back = function() {
        $window.history.back();
    }
}])
