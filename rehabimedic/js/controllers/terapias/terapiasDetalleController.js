app.controller('TerapiasDetalleCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$filter' ,'$window', '$timeout', 'Notification', 'terapiasFac', 'pacientes', 'pacientesFac', function($scope, $rootScope, $state, $stateParams, $filter, $window, $timeout, Notification, terapiasFac, pacientes, pacientesFac) {
    
    $scope.selected = [];
    $scope.pacientes = pacientes.data;
    $scope.diamayor = 0;
    $scope.terapia = {};
    $scope.terapia.citas = [];
    $scope.cita = {};
    console.log($rootScope.user);
    
    $scope.hstep = 1;
    $scope.mstep = 30;
    $scope.ismeridian = true;
    
    $scope.toggleHora = function() {
      $scope.ismeridian = ! $scope.ismeridian;
    };    
    
    $scope.dias = [ { "id": 1, "nombre": "Lunes", "value": 1}, { "id": 2, "nombre": "Martes", "value": 2}, { "id": 3, "nombre": "Miércoles", "value": 3}, { "id": 4, "nombre": "Jueves", "value": 4}, { "id": 5, "nombre": "Viernes", "value": 5}, { "id": 6, "nombre": "Sábado", "value": 6}];
    
    $scope.resumen = function() {
        var c = 1;
        $scope.terapia.citas = [];
        y = $scope.terapia.paciente_terapia_fecha.getFullYear(); 
        m = $scope.terapia.paciente_terapia_fecha.getMonth();
        d = $scope.terapia.paciente_terapia_fecha.getDate();
        
        $scope.terapia.paciente_terapia_fecha = new Date(y, m, d);
        $scope.terapia.terapia_semanas = $scope.terapia.terapia_semanas;
        $scope.terapia.terapia_sesiones_semana = $scope.selected.length;
        $scope.terapia.terapia_sesiones_duracion = $scope.terapia.terapia_sesiones_duracion;
        $scope.terapia.terapia_sesiones_total = $scope.terapia.terapia_semanas * $scope.terapia.terapia_sesiones_semana;
        $scope.terapia.terapia_duracion_total = $scope.terapia.terapia_sesiones_total * $scope.terapia.terapia_sesiones_duracion;
        $scope.terapia.terapia_fecha_estimada_inicio = $scope.terapia.paciente_terapia_fecha;
        $scope.fecha_inicial = $scope.terapia.terapia_fecha_estimada_inicio;
        
        var today, todayNumber, mondayNumber, monday;     
        today = $scope.fecha_inicial;
        todayNumber = today.getDay();
        mondayNumber = 1 - todayNumber;
        sundayNumber = 7 - todayNumber;
        monday = new Date(today.getFullYear(), today.getMonth(), today.getDate()+mondayNumber);
        $scope.fecha_inicial = monday;        
        for(var i = 0; i < $scope.terapia.terapia_semanas; i++) {
            for(var j = 0; j < $scope.terapia.terapia_sesiones_semana; j++) {
                y = $scope.fecha_inicial.getFullYear();
                m = $scope.fecha_inicial.getMonth();
                d = $scope.fecha_inicial.getDate();
                $scope.cita.cita_fecha = new Date(y, m, d+$scope.selected[j].value-1);
                y = $scope.cita.cita_fecha.getFullYear(); 
                m = $scope.cita.cita_fecha.getMonth();
                d = $scope.cita.cita_fecha.getDate();
                $scope.cita.cita_hora = $scope.terapia.cita_hora;
                h = $scope.cita.cita_hora.getHours();
                min = $scope.cita.cita_hora.getMinutes();
                $scope.cita.cita_fecha_hora = new Date(y, m, d, h, min);
                $scope.cita.cita_fecha_hora = $filter('date')($scope.cita.cita_fecha_hora,'yyyy-MM-dd HH:mm:ss');
                $scope.cita.cita_descripcion = "Terapia " + c + " de " + $scope.terapia.terapia_sesiones_total;
                if ($rootScope.user.persona.doctor)
                    $scope.cita.doctor_id = $rootScope.user.persona.doctor.id;
                console.log($scope.cita);
                $scope.terapia.citas.push($scope.cita);
                $scope.cita = {};
                c++;
            }
            y = $scope.fecha_inicial.getFullYear();
            m = $scope.fecha_inicial.getMonth();
            d = $scope.fecha_inicial.getDate();            
            $scope.fecha_inicial = new Date(y, m, d+7);            
        }
        $scope.terapia.terapia_fecha_estimada_fin = $scope.terapia.citas[$scope.terapia.citas.length-1].cita_fecha;
        console.log($scope.terapia);
    }
    
    $scope.ShowSelected=function(item){
        var idx = $scope.selected.indexOf(item);
        // is currently selected
        if (idx > -1) {
            $scope.selected.splice(idx, 1);
        }
        // is newly selected
        else {
            $scope.selected.push(item);
        }
        $scope.selected.sort(function(a, b){
            return a.value-b.value;
        })
        console.log($scope.selected);
        $scope.resumen();
    };
    
    terapiasFac.get(parseInt($stateParams.id,10))
    .then(
        function(response){
            $scope.terapia = response.data;
            console.log($scope.terapia);
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
    
    $scope.save = function() {
        $scope.terapia.paciente_terapia_fecha = new Date($scope.terapia.paciente_terapia_fecha);
        $scope.terapia.paciente_terapia_fecha = $filter('date')($scope.terapia.paciente_terapia_fecha,'yyyy-MM-dd');
        $scope.terapia.terapia_fecha_estimada_inicio =  new Date($scope.terapia.terapia_fecha_estimada_inicio);
        $scope.terapia.terapia_fecha_estimada_inicio = $filter('date')($scope.terapia.terapia_fecha_estimada_inicio,'yyyy-MM-dd');
        $scope.terapia.terapia_fecha_estimada_fin = new Date($scope.terapia.terapia_fecha_estimada_fin);
        $scope.terapia.terapia_fecha_estimada_fin = $filter('date')($scope.terapia.terapia_fecha_estimada_fin,'yyyy-MM-dd');
        console.log($scope.terapia);
        terapiasFac.save($scope.terapia)
        .then(
            function(response){
                console.log("Terapia registrada!");
                console.log(response);
                console.log($scope.terapia);
                $timeout(function() {
                    $state.go('app.terapias');
                    console.log("State Changed");
                    Notification({
                        message: 'Terapia registrada correctamente!',
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
                console.log($scope.terapia);
            }
        );
    }
    
    $scope.back = function() {
        $window.history.back();
    }
}])