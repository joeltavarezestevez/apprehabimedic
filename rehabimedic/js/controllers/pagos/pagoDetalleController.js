app.controller('PagoCtrl', ['$scope', '$rootScope', '$state', '$filter', '$http', '$timeout', 'Notification', 'pacientes', 'pacientesFac', 'pagos', 'pagosFac', function($scope, $rootScope, $state, $filter, $http, $timeout, Notification, pacientes, pacientesFac, pagos, pagosFac) {
    
    $scope.pago = {};
    $scope.monto_pagado = 0;
    $scope.monto_pendiente = 0;    
    $scope.pacientes = pacientes.data;
    $scope.citas_pagadas = [];
    $scope.citas_pendientes = [];
    $scope.pagos = pagos.data;
    console.log($scope.pagos);
    $scope.paciente = {};
    $scope.today = new Date();
    
    $scope.calcular = function(index) {
        console.log($scope.paciente.paciente_servicios[0].servicio_precio);
        var precio = $scope.paciente.paciente_servicios[0].servicio_precio;
        if (index == 1) {
            if($scope.pago.pago_cantidad.length > 0) {
                $scope.pago.pago_monto = $scope.pago.pago_cantidad * precio;
            }
            else {
                $scope.pago.pago_monto = "";
            }
            console.log($scope.pago.pago_monto);            
        }
        else {
            if($scope.pago.pago_monto.length > 0) {
                $scope.pago.pago_cantidad = parseFloat($scope.pago.pago_monto / precio);
            }
            else {
                $scope.pago.pago_cantidad = "";
            }
            console.log($scope.pago.pago_cantidad);                        
        }
    }
    
    $scope.updatePaciente = function(index) {
        $scope.monto_pagado = 0;
        $scope.monto_pendiente = 0;
        $scope.citas_pagadas = [];
        $scope.citas_pendientes = [];
        
        pacientesFac.get(index).success(function(response){
            d = new Date(response.persona.persona_fecha_nacimiento);
            d.setDate(d.getDate() + 1);
            response.persona.persona_fecha_nacimiento = d;
            var i = 0;
            for(i = 0; i<response.citas.length; i++) {
                response.citas[i].cita_fecha_hora = new Date(response.citas[i].cita_fecha_hora);
            }
            
            $scope.paciente = response;
            $scope.fecha_nacimiento = $filter('date')($scope.paciente.persona.persona_fecha_nacimiento,'dd-MM-yyyy');

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
            for(i=0; i< $scope.paciente.citas.length; i++) {
                if(parseFloat($scope.paciente.citas[i].cita_monto_pendiente) == 0) {
                    $scope.monto_pagado = $scope.monto_pagado + parseFloat($scope.paciente.citas[i].cita_monto); 
                    $scope.citas_pagadas.push($scope.paciente.citas[i]);
                }
                else {
                    $scope.monto_pendiente = $scope.monto_pendiente + parseFloat($scope.paciente.citas[i].cita_monto_pendiente);
                    $scope.citas_pendientes.push($scope.paciente.citas[i]);
                }
            }
            console.log($scope.paciente);
            console.log($scope.citas_pendientes);
            console.log($scope.citas_pagadas);
            console.log($scope.monto_pagado);
            console.log($scope.monto_pendiente);
        })
    }
    
    $scope.filterPagadas = function(obj) {
        return parseFloat(obj.cita_monto_pendiente) == 0;
    }

    $scope.filterPendientes = function(obj) {
        return parseFloat(obj.cita_monto_pendiente) > 0;
    }
      
    $scope.save = function(data, id) {
        $scope.pago.pago_fecha = new Date();
        $scope.pago.pago_fecha = $filter('date')($scope.pago.pago_fecha,'yyyy-MM-dd HH:mm:ss');
        $scope.pago.usuario_id = $rootScope.user.id;
        console.log($scope.pago);
        pagosFac.save($scope.pago)
        .then(
            function(response){
                console.log("pago registrado!");
                console.log(response);
                console.log($scope.pago);
                pagosFac.get(parseInt(response.data.id,10))
                .success(function(data) {
                    d = new Date(data.pago_fecha);
                    data.pago_fecha = d;
                    console.log(data);
                    $scope.pago = data;
                    $scope.pago.terapias_totales = parseFloat($scope.pago.paciente.paciente_terapias_pagadas) + parseFloat($scope.pago.paciente.paciente_terapias_pendientes_pago);
                    $scope.updatePaciente($scope.pago.paciente_id);
                    $timeout(function() {
                        var el = document.getElementById('printElement');
                        angular.element(el).triggerHandler('click');                    
                        $state.go('app.pagos');
                        console.log("State Changed");
                        Notification({
                            message: 'Pago realizado correctamente!',
                            title: 'Registro realizado',
                            delay: 5000,
                            positionX: 'center',
                            positionY: 'top'
                        }, 'success');                    
                    }, 1000, false);
                })    
            },
            function(response){
                console.log("Error");
                console.log(response);
                console.log($scope.pago);
                if(response.status == 400 && response.data.message){
                    Notification({
                        message: 'Errores al intentar crear el registro. Revise los mensajes arriba.',
                        title: 'Error',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'error');
                    console.log('Errol manin!');
                    $scope.alert = true;
                    $scope.mensajes = response.data.message;
                }
            }
        );
    }
    
    $scope.printDiv = function (divName) {
        console.log('imprimiendo recibo...');
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;      

        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            var popupWin = window.open('', '_blank', 'width=800,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWin.window.focus();
            popupWin.document.write('<!DOCTYPE html><html><head>' +
                '<link rel="stylesheet" type="text/css" href="../bower_components/bootstrap/dist/css/bootstrap.min.css" /> <link href="../bower_components/bootstrap/dist/css/bootstrap-theme.min.css" rel="stylesheet" type="text/css" /> <link href="../bower_components/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" /> <link href="css/material-icons.css" rel="stylesheet" type="text/css" /> <link href="../bower_components/animate.css/animate.min.css" rel="stylesheet" type="text/css" /><script src="../bower_components/angular/angular.js"></script>' +
                '</head><body onload="window.print()"><div class="container-fluid" style="margin-left: 0px; margin-right: 0px;">' + printContents + '</div></html>');
            popupWin.onbeforeunload = function (event) {
                popupWin.close();
                return '.\n';
            };
            popupWin.onabort = function (event) {
                popupWin.document.close();
                popupWin.close();
            }
        } else {
            var popupWin = window.open('', '_blank', 'width=800,height=600');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="../bower_components/bootstrap/dist/css/bootstrap.min.css" /> <link href="../bower_components/bootstrap/dist/css/bootstrap-theme.min.css" rel="stylesheet" type="text/css" /> <link href="../bower_components/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" /> <link href="css/material-icons.css" rel="stylesheet" type="text/css" /> <link href="../bower_components/animate.css/animate.min.css" rel="stylesheet" type="text/css" /></head><body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
        }
        popupWin.document.close();

        return true;
    }    
      
    $scope.back = function() {
        $window.history.back();
    }      

}]);