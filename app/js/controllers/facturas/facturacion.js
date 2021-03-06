app.controller('FacturacionCtrl', ['$scope', '$window', '$rootScope', '$state', '$filter', '$http', '$timeout', 'Notification', 'pacientes', 'servicios', 'pacientesFac', 'secuenciasFac', 'facturasFac', 'getRNCFac', function($scope, $window, $rootScope, $state, $filter, $http, $timeout, Notification, pacientes, servicios, pacientesFac, secuenciasFac, facturasFac, getRNCFac) {
    
    $scope.comprobantes = [
      {id:3, nombre:'Credito Fiscal'},
      {id:4, nombre:'Consumidor Final'}
    ]
    $scope.factura = {};
    //$scope.servicio = {};
    $scope.servicio_id = "0";
    $scope.factura.factura_metodo_pago = "1";
    $scope.factura.factura_subtotal = 0.00;
    $scope.factura.factura_cobertura = 0.00;
    $scope.factura.factura_diferencia = 0.00;
    $scope.factura.factura_descuento = 0.00;
    $scope.factura.factura_total = 0.00;
    $scope.pacientes = pacientes.data;
    $scope.servicios = servicios.data;
    console.log($scope.pacientes);
    console.log($scope.servicios);
    
    $scope.factura.factura_tipo = "Contado";
    $scope.factura.factura_comprobante_tipo = 4;    

    $scope.factura.detalles = [];
    
    $scope.buscarRNC =  function(rnc) {
        $scope.rnc = rnc;
        if (rnc.length >= 9) {
            getRNCFac.get(rnc)
            .success(function(response){
                console.log(response);
                $scope.factura.factura_razon_social = response.name;
                console.log(response.name);
            })
            .error(function(response){
                console.log(response);
            })

        }
        else {
            $scope.factura.factura_razon_social = "";
        }
    }

    //$scope.buscarRNC('130674779');

    $scope.updatePaciente = function(index) {
        
        $scope.factura.factura_subtotal = 0.00;
        $scope.factura.factura_itbis = 0.00;
        $scope.factura.factura_descuento = 0.00;
        $scope.factura.factura_total = 0.00;        
        $scope.factura.detalles = [];
        $scope.servicio = {};
        
        pacientesFac.get(index).success(function(response){
                d = new Date(response.persona.persona_fecha_nacimiento);
                d.setDate(d.getDate() + 1);
                response.persona.persona_fecha_nacimiento = d;
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
        $scope.factura.factura_cobertura = $scope.factura.factura_cobertura - $scope.factura.detalles[index].servicio_cobertura;
        $scope.factura.factura_diferencia = $scope.factura.factura_diferencia - $scope.factura.detalles[index].servicio_diferencia;
        //$scope.factura.factura_itbis = $scope.factura.factura_subtotal * 0.18;
        //$scope.factura.factura_total = $scope.factura.factura_subtotal + $scope.factura.factura_itbis - $scope.factura.factura_descuento;        
        $scope.factura.factura_total = $scope.factura.factura_subtotal - $scope.factura.factura_descuento;
        $scope.factura.detalles.splice(index, 1);
    };

    $scope.updatePrecio = function(id) {
        var i = 0;
        var j = 0;
        console.log($scope.paciente);
        if($scope.paciente.aseguradora_id != 1 && $scope.paciente.plan_id != 1) {
            for (i= 0; i<$scope.paciente.aseguradora.planes.length; i++) {
                if ($scope.paciente.aseguradora.planes[i].id == $scope.paciente.plan_id) {
                    for (j= 0; j < $scope.paciente.aseguradora.planes[i].planes_servicios.length; j++) {
                        if ($scope.paciente.aseguradora.planes[i].planes_servicios[j].id == id) {
                            $scope.servicio.servicio_id = id;
                            $scope.servicio.servicio_precio = $scope.paciente.aseguradora.planes[i].planes_servicios[j].servicio_precio;
                            $scope.servicio.servicio_cobertura = $scope.paciente.aseguradora.planes[i].planes_servicios[j].servicio_cobertura;
                            $scope.servicio.servicio_nombre = $scope.paciente.aseguradora.planes[i].planes_servicios[j].servicio.servicio_nombre;
                        }
                    }
                }            
            }            
        }
        else {
            for (i= 0; i < $scope.servicios.length; i++) {
                if ($scope.servicios[i].id == id) {
                    $scope.servicio.servicio_id = id;
                    $scope.servicio.servicio_precio = $scope.servicios[i].servicio_precio;
                    $scope.servicio.servicio_cobertura = 0.00;
                    $scope.servicio.servicio_nombre = $scope.servicios[i].servicio_nombre;
                }
            }            
        }
        console.log($scope.servicio);
    }
    // add Detalle
    $scope.addDetalle = function() {
        if(!$scope.servicio.servicio_id || !$scope.servicio.servicio_cantidad) {
            Notification({
                message: 'Debe completar todos los campos del servicio o producto a facturar.',
                title: 'Error',
                delay: 5000,
                positionX: 'center',
                positionY: 'top'
            }, 'error');
        }
        else {
            $scope.servicio.servicio_monto = $scope.servicio.servicio_precio * $scope.servicio.servicio_cantidad;
            $scope.servicio.servicio_cobertura = $scope.servicio.servicio_cobertura * $scope.servicio.servicio_cantidad;
            $scope.servicio.servicio_diferencia = $scope.servicio.servicio_monto - $scope.servicio.servicio_cobertura;
            for (var i=0; i < $scope.factura.detalles.length; i++) {
                if($scope.servicio.servicio_id == $scope.factura.detalles[i].servicio_id) {
                    $scope.removeDetalle(i);
                    break;
                }
            }
            $scope.factura.detalles.push($scope.servicio);
            console.log($scope.factura.detalles.length);
            $scope.factura.factura_subtotal = 0.00;
            $scope.factura.factura_cobertura = 0.00;
            $scope.factura.factura_diferencia = 0.00;
            for (var i=0; i < $scope.factura.detalles.length; i++) {
            
            $scope.factura.factura_subtotal = $scope.factura.factura_subtotal + $scope.factura.detalles[i].servicio_monto;
            $scope.factura.factura_cobertura = $scope.factura.factura_cobertura + $scope.factura.detalles[i].servicio_cobertura;
            $scope.factura.factura_diferencia = $scope.factura.factura_diferencia + $scope.factura.detalles[i].servicio_diferencia;
            //$scope.factura.factura_itbis = $scope.factura.factura_subtotal * 0.18;            
            }
            //$scope.factura.factura_total = $scope.factura.factura_subtotal + $scope.factura.factura_itbis - $scope.factura.factura_descuento;
            $scope.factura.factura_total = $scope.factura.factura_diferencia - $scope.factura.factura_descuento;
            $scope.servicio = {};
            $scope.servicio_id = "0";
            console.log($scope.servicio);
            console.log($scope.servicio_id);
        }
    }
      
    $scope.aplicardescuento = function() {
        if($scope.factura.factura_diferencia > 0 && $scope.factura.factura_descuento < $scope.factura.factura_diferencia){
            $scope.factura.factura_descuento = $scope.factura.factura_descuento_monto;
            $scope.factura.factura_total = $scope.factura.factura_diferencia - $scope.factura.factura_descuento;
            //$scope.factura.descuento_monto = 0.00;
            $scope.bloqueado = true;
        }
        else if ($scope.factura.factura_descuento > $scope.factura.factura_diferencia) {
            alert("El descuento no puede ser mayor que la diferencia a pagar");
        }
        else {
            alert("No tiene detalles agregados a la factura");
        }        
    };
    $scope.elegirdescuento = function(value){
        if(value == false){
            $scope.valor = $scope.factura.factura_descuento;
            $scope.factura.factura_total = $scope.factura.factura_diferencia;
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
            $scope.factura.factura_metodo_pago = 0;
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
                        $state.reload();
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
