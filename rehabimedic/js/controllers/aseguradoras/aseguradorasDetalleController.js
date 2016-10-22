app.controller('AseguradorasDetalleCtrl', ['$scope', '$stateParams', '$window', '$timeout', '$state', 'Notification', 'aseguradorasFac', function($scope, $stateParams, $window, $timeout, $state, Notification, aseguradorasFac) {

    $scope.aseguradora = {};

    aseguradorasFac.get(parseInt($stateParams.id,10))
    .then(
        function(response){
            $scope.aseguradora = response.data;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );
    
    $scope.save = function() {
        $scope.aseguradora.estado_id = 1;
        aseguradorasFac.save($scope.aseguradora)
        .then(
            function(response){
                console.log("Aseguradora registrada!");
                console.log(response);
                console.log($scope.aseguradora);
                $timeout(function() {
                    $state.go('app.aseguradoras');
                    console.log("State Changed");
                    Notification({
                        message: 'Aseguradora registrada correctamente!',
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
                console.log($scope.aseguradora);
            }
        );
    }
    
    $scope.update = function() {
        aseguradorasFac.update($scope.aseguradora, parseInt($stateParams.id,10))
        .then(
            function(response){
                console.log("Aseguradora actualizada!");
                console.log(response);
                console.log($scope.aseguradora);
                $timeout(function() {
                    $state.go('app.aseguradoras');
                    console.log("State Changed");
                    Notification({
                        message: 'Aseguradora actualizada correctamente!',
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
                console.log($scope.aseguradora);
            }
        );
    }
    
    $scope.back = function() {
        $window.history.back();
    }
}])
