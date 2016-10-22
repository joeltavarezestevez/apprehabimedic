app.controller('CitasDetalleCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$filter' ,'$window', '$timeout', 'Notification', 'citasFac', 'pacientesFac', 'pacientes', 'doctores', function($scope, $rootScope, $state, $stateParams, $filter, $window, $timeout, Notification, citasFac, pacientesFac, pacientes, doctores) {
    
    $scope.cita = {};
    $scope.pacientes = pacientes.data;
    $scope.doctores = doctores.data;
    
    $scope.hstep = 1;
    $scope.mstep = 30;
    $scope.ismeridian = true;
    
    $scope.toggleHora = function() {
      $scope.ismeridian = ! $scope.ismeridian;
    };    
    
    if($stateParams.id) {
        citasFac.get(parseInt($stateParams.id,10))
        .then(
            function(response){
                console.log(response.data.cita_fecha_hora);
                d = new Date(response.data.cita_fecha_hora);
                console.log(d);
                response.data.cita_fecha_hora = d;
                y = response.data.cita_fecha_hora.getFullYear(); 
                m = response.data.cita_fecha_hora.getMonth();
                d = response.data.cita_fecha_hora.getDate();

                h = response.data.cita_fecha_hora.getHours();
                min = response.data.cita_fecha_hora.getMinutes();

                response.data.cita_fecha = new Date(y, m, d);
                response.data.cita_hora = new Date(null, null, null, h, min);
                $scope.cita = response.data;
                console.log($scope.cita);
            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
            }
        );        
    }
    
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
    
    $scope.save = function() {
        y = $scope.cita.cita_fecha.getFullYear(); 
        m = $scope.cita.cita_fecha.getMonth();
        d = $scope.cita.cita_fecha.getDate();
        
        h = $scope.cita.cita_hora.getHours();
        min = $scope.cita.cita_hora.getMinutes();
        console.log(h + ':' + min);
        
        $scope.cita.cita_fecha_hora = new Date(y, m, d, h, min);
        $scope.cita_fecha_hora = $scope.cita.cita_fecha_hora;  
        $scope.cita.cita_fecha_hora = $filter('date')($scope.cita.cita_fecha_hora,'yyyy-MM-dd HH:mm:ss');
        citasFac.save($scope.cita)
        .then(
            function(response){
                console.log("Cita registrada!");
                console.log(response);
                console.log($scope.cita);
                $timeout(function() {
                    $state.go('app.citas');
                    console.log("State Changed");
                    Notification({
                        message: 'Cita registrada correctamente!',
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
                console.log($scope.cita);
            }
        );
        $scope.cita.cita_fecha_hora = $scope.cita_fecha_hora;
    }
    
    $scope.getType = function(test){
        return( typeof test);
    }
    
    $scope.update = function() {
        
        y = $scope.cita.cita_fecha.getFullYear(); 
        m = $scope.cita.cita_fecha.getMonth();
        d = $scope.cita.cita_fecha.getDate();
        
        h = $scope.cita.cita_hora.getHours();
        min = $scope.cita.cita_hora.getMinutes();
        
        $scope.cita.cita_fecha_hora = new Date(y, m, d, h, min);
        $scope.cita_fecha_hora = $scope.cita.cita_fecha_hora;
        $scope.cita.cita_fecha_hora = $filter('date')($scope.cita.cita_fecha_hora,'yyyy-MM-dd HH:mm:ss');
        //console.log($scope.cita.cita_fecha_hora);
        //console.log($scope.getType($scope.cita.cita_fecha_hora));
        
        citasFac.update($scope.cita, parseInt($stateParams.id,10))
        .then(
            function(response){
                console.log("cita actualizada!");
                console.log(response);
                console.log($scope.cita);
                $timeout(function() {
                    $state.go('app.citas');
                    console.log("State Changed");
                    Notification({
                        message: 'Cita actualizada correctamente!',
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
                console.log($scope.cita);
            }
        );
        
        $scope.cita.cita_fecha_hora = $scope.cita_fecha_hora;
    }
    
    $scope.back = function() {
        $window.history.back();
    }
}])