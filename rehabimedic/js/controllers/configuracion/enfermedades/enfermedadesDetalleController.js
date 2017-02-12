app.controller('EnfermedadesDetalleCtrl', ['$scope', '$stateParams', '$window', '$timeout', '$state', 'Notification', 'enfermedadesFac', function($scope, $stateParams, $window, $timeout, $state, Notification, enfermedadesFac) {

    $scope.enfermedad = {};

    enfermedadesFac.get(parseInt($stateParams.id,10))
    .then(
        function(response){
            $scope.enfermedad = response.data;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );
    
    $scope.save = function() {
        $scope.enfermedad.estado_id = 1;
        enfermedadesFac.save($scope.enfermedad)
        .then(
            function(response){
                console.log("enfermedad registrada!");
                console.log(response);
                console.log($scope.enfermedad);
                $timeout(function() {
                    $state.go('app.configuracion-enfermedades');
                    console.log("State Changed");
                    Notification({
                        message: 'Enfermedad registrada correctamente!',
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
                console.log($scope.enfermedad);
            }
        );
    }
    
    $scope.update = function() {
        enfermedadesFac.update($scope.enfermedad, parseInt($stateParams.id,10))
        .then(
            function(response){
                console.log("Enfermedad actualizada!");
                console.log(response);
                console.log($scope.enfermedad);
                $timeout(function() {
                    $state.go('app.configuracion-enfermedades');
                    console.log("State Changed");
                    Notification({
                        message: 'Enfermedad actualizada correctamente!',
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
                console.log($scope.enfermedad);
            }
        );
    }
    
    $scope.back = function() {
        $window.history.back();
    }
}])
