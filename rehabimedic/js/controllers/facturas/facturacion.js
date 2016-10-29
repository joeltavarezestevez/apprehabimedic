app.controller('FacturacionCtrl', ['$scope', '$rootScope', '$state', '$filter', '$http', '$timeout', 'Notification', 'pacientes', 'servicios', 'pacientesFac', 'secuenciasFac', 'facturasFac', function($scope, $rootScope, $state, $filter, $http, $timeout, Notification, pacientes, servicios, pacientesFac, secuenciasFac, facturasFac) {
    
    $scope.comprobantes = [
      {id:3, nombre:'Credito Fiscal'},
      {id:4, nombre:'Consumidor Final'}
    ]
    $scope.factura = {};
    $scope.factura.factura_metodo_pago = "1";
    $scope.factura.factura_subtotal = 0.00;
    $scope.factura.factura_itbis = 0.00;
    $scope.factura.factura_descuento = 0.00;
    $scope.factura.factura_total = 0.00;
    $scope.pacientes = pacientes.data;
    $scope.servicios = servicios.data;
    console.log($scope.servicios);
    
    $scope.factura.factura_tipo = "Contado";
    $scope.factura.factura_comprobante_tipo = 4;    

    $scope.factura.detalles = [];
    
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
      
    $scope.cambiarNCF = function(index) {
        secuenciasFac.get(index).success(function(response){
            $scope.prefijoNCF = response.secuencia_prefijo;
            $scope.factura.factura_ncf = response.secuencia_actual;
        })
    }
    
    $scope.cambiarFactura = function(index) {
        console.log(index);
        if (index == "Contado")
            $scope.id = 1;
        else
            $scope.id = 2;
        
        secuenciasFac.get($scope.id).success(function(res){
            $scope.factura.factura_numero = res.secuencia_actual;
        })
    }
    
    $scope.cambiarNCF(4);
    $scope.cambiarFactura("Contado");    
    
    // remove Detalle
    $scope.removeDetalle = function(index) {
        $scope.factura.factura_subtotal = $scope.factura.factura_subtotal - $scope.factura.detalles[index].servicio_monto;
        //$scope.factura.factura_itbis = $scope.factura.factura_subtotal * 0.18;
        //$scope.factura.factura_total = $scope.factura.factura_subtotal + $scope.factura.factura_itbis - $scope.factura.factura_descuento;        
        $scope.factura.factura_total = $scope.factura.factura_subtotal - $scope.factura.factura_descuento;
        $scope.factura.detalles.splice(index, 1);
    };

    $scope.updatePrecio = function(id) {
        console.log(id);
        $scope.servicio = {};
        $scope.servicio.servicio_id = $scope.servicios[id-1].id;
        $scope.servicio.servicio_precio = $scope.servicios[id-1].servicio_precio;
        $scope.servicio.servicio_nombre = $scope.servicios[id-1].servicio_nombre;
    }
    // add Detalle
    $scope.addDetalle = function() {
        $scope.servicio.servicio_monto = $scope.servicio.servicio_precio * $scope.servicio.servicio_cantidad;
        
        for (var i=0; i < $scope.factura.detalles.length; i++) {
            if($scope.servicio.servicio_id == $scope.factura.detalles[i].servicio_id) {
                $scope.removeDetalle(i);
                break;
            }
        }
        $scope.factura.detalles.push($scope.servicio);
        console.log($scope.factura.detalles.length);
        $scope.factura.factura_subtotal = 0.00;
        for (var i=0; i < $scope.factura.detalles.length; i++) {
        
        $scope.factura.factura_subtotal = $scope.factura.factura_subtotal + $scope.factura.detalles[i].servicio_monto;
        //$scope.factura.factura_itbis = $scope.factura.factura_subtotal * 0.18;            
        }
        //$scope.factura.factura_total = $scope.factura.factura_subtotal + $scope.factura.factura_itbis - $scope.factura.factura_descuento;
        $scope.factura.factura_total = $scope.factura.factura_subtotal - $scope.factura.factura_descuento;
        $scope.servicioselected = {};
        $scope.servicio = {};
    };
      
    $scope.aplicardescuento = function() {
        if($scope.factura.factura_total > 0){
            $scope.factura.factura_descuento = $scope.factura.factura_descuento_monto;
            $scope.factura.factura_total = $scope.factura.factura_subtotal - $scope.factura.factura_descuento;
            //$scope.factura.descuento_monto = 0.00;
            $scope.bloqueado = true;
        }
        else {
            alert("No tiene detalles agregados a la factura");
        }
    };
    $scope.elegirdescuento = function(value){
        if(value == false){
            $scope.valor = $scope.factura.factura_descuento;
            $scope.factura.factura_total = $scope.factura.factura_subtotal;
            $scope.factura.factura_descuento = 0.00;
            $scope.factura.factura_descuento_monto = 0.00;
        }
        else {
            $scope.bloqueado = false;
        }
        console.log(value);
    }
      
    $scope.save = function(data, id) {
        $scope.factura.factura_fecha = new Date();
        $scope.factura.factura_fecha = $filter('date')($scope.factura.factura_fecha,'yyyy-MM-dd HH:mm:ss');
        $scope.factura.factura_ncf = $scope.prefijoNCF + $filter('minLength')($scope.factura.factura_ncf, 8);
        $scope.factura.factura_numero = $filter('minLength')($scope.factura.factura_numero, 8);
        $scope.factura.usuario_id = $rootScope.user.id;
        if ($scope.factura.factura_tipo != "Contado") {
            $scope.factura.factura_balance = $scope.factura.factura_total;
        }
        else {
            $scope.factura.factura_balance = 0.00;
        }
        
        facturasFac.save($scope.factura)
        .then(
            function(response){
                console.log("factura registrada!");
                console.log(response);
                console.log($scope.factura);
                facturasFac.get(parseInt(response.data.id,10))
                .success(function(data) {
                    d = new Date(data.factura_fecha);
                    data.factura_fecha = d;
                    console.log(data);
                    $scope.factura = data;
                    $timeout(function() {
                        var el = document.getElementById('printElement');
                        angular.element(el).triggerHandler('click');                    
                        $state.go('app.facturas');
                        console.log("State Changed");
                        Notification({
                            message: 'Factura registrada correctamente!',
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
                console.log($scope.factura);
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
        console.log('imprimiendo factura...');
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