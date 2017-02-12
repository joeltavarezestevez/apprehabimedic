app.controller('ConsultasDetalleCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$filter' ,'$window', '$timeout', 'Notification', 'consultasFac', 'pacientes', 'pacientesFac', function($scope, $rootScope, $state, $stateParams, $filter, $window, $timeout, Notification, consultasFac, pacientes, pacientesFac) {
    
    $scope.consulta = {};
    $scope.pacientes = pacientes.data;

    consultasFac.get(parseInt($stateParams.id,10))
    .then(
        function(response){
            $scope.consulta = response.data;
            console.log($scope.consulta);
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );
    
    $scope.updatePaciente = function(index) {
        pacientesFac.get(index).success(function(response){
            $scope.paciente = response;
            console.log($scope.paciente);
        })
    }
    
    $scope.save = function() {
        if ($rootScope.user.persona.doctor != null) {
         $scope.consulta.doctor_id = $rootScope.user.persona.doctor.id;   
        }
        else {
            $scope.consulta.doctor_id = 1;
        }
        $scope.consulta.consulta_fecha = new Date();
        $scope.consulta_fecha = $scope.consulta.consulta_fecha;  
        $scope.consulta.consulta_fecha = $filter('date')($scope.consulta.consulta_fecha,'yyyy-MM-dd');
        consultasFac.save($scope.consulta)
        .then(
            function(response){
                console.log("Consulta registrada!");
                console.log(response);
                console.log($scope.consulta);
                $timeout(function() {
                    $state.go('app.consultas');
                    console.log("State Changed");
                    Notification({
                        message: 'Consulta registrada correctamente!',
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
                console.log($scope.consulta);
            }
        );
        $scope.consulta.consulta_fecha = $scope.consulta_fecha;
    }
    
    $scope.update = function() {
        $scope.consulta_fecha = $scope.consulta.consulta_fecha;  
        $scope.consulta.consulta_fecha = $filter('date')($scope.consulta.consulta_fecha,'yyyy-MM-dd');                
        consultasFac.update($scope.consulta, parseInt($stateParams.id,10))
        .then(
            function(response){
                console.log("consulta actualizada!");
                console.log(response);
                console.log($scope.consulta);
                $timeout(function() {
                    $state.go('app.consultas');
                    console.log("State Changed");
                    Notification({
                        message: 'Consulta actualizada correctamente!',
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
                console.log($scope.consulta);
            }
        );
        $scope.consulta.consulta_fecha = $scope.consulta_fecha;
    }
    
    $scope.back = function() {
        $window.history.back();
    }
}])