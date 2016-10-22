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
                d = new Date(response.persona.persona_fecha_nacimiento);
                d.setDate(d.getDate() + 1);
                response.persona.persona_fecha_nacimiento = d;
                $scope.paciente = response;
                $scope.fecha_nacimiento = $filter('date')($scope.paciente.persona.persona_fecha_nacimiento,'dd-MM-yyyy');
                
                $scope.paciente.enfermedad_id = [];
                angular.forEach(response.pacientes_enfermedades, function(value, key) {
                    $scope.paciente.enfermedad_id.push(value.enfermedad_id.toString());
                });
                
                $scope.paciente.cirugias = [];
                angular.forEach(response.pacientes_cirugias, function(value, key) {
                    $scope.paciente.cirugias.push(value.cirugia_descripcion.toString());
                });
                
                if(response.pacientes_fracturas.length > 0){
                    $scope.paciente.fractura = 1;
                    $scope.paciente.fracturas = [];
                    angular.forEach(response.pacientes_fracturas, function(value, key) {
                        $scope.paciente.fracturas.push(value.cuerpo_parte_id.toString());
                    });                    
                }
                else {
                    $scope.paciente.fractura = 2;
                }
                
                angular.forEach(response.persona.personas_telefonos, function(value, key) {
                    if (value.tipo_telefono_id == 1) {
                        $scope.paciente.persona_telefono = value.telefono_numero;
                    }
                    else {
                        $scope.paciente.persona_celular = value.telefono_numero;
                    }
                });

                if($scope.paciente.aseguradora_id != 1) {
                    $scope.paciente.seguro = 1;
                }
                else {
                    $scope.paciente.seguro = 0;
                }
                
                if($scope.paciente.paciente_referencia == null) {
                    $scope.paciente.referencia_tipo = "ninguno";
                }
                else {
                    $scope.paciente.referencia_tipo = $scope.paciente.paciente_referencia.referencia_tipo;
                    $scope.paciente.persona_referencia = $scope.paciente.paciente_referencia.persona_referencia;
                }
                
                if($scope.paciente.pacientes_fracturas.length == 0){
                    $scope.paciente.fractura = 2;
                }
            console.log($scope.paciente);
        })
    }
    
    $scope.print = function() {
        console.log($rootScope.user);
    }
    $scope.print();
    $scope.save = function() {
        $scope.consulta.doctor_id = $rootScope.user.persona.doctor.id;
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