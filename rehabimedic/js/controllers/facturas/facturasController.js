app.controller('ModalInstanceFacturasCtrl', ['$scope', '$rootScope', '$filter', '$uibModalInstance', '$timeout', '$state', 'Id', 'Notification', 'facturasFac', 'secuenciasFac', 'notasdeCreditoFac', function($scope, $rootScope, $filter, $modalInstance, $timeout, $state, Id, Notification, facturasFac, secuenciasFac, notasdeCreditoFac) {

    $scope.registro = {};
    $scope.nota_credito = {};
    $scope.prefijoNCF = "";

    facturasFac.get(parseInt(Id,10))
    .success(function(data) {
        d = new Date(data.factura_fecha);
        data.factura_fecha = d;
        $scope.fecha = $filter('date')(data.factura_fecha, 'dd/MMM hh:mma');
        $scope.registro.nombres = 'la factura del '+ data.paciente.persona.persona_nombres + ' ' + data.paciente.persona.persona_apellidos + ' en fecha: ' + $scope.fecha;
        console.log(data);
        $scope.factura = data;
    });   
    
    $scope.anularFactura = function () {
      facturasFac.anularFactura($scope.factura, Id)
          .then(
          function(data) {
              $modalInstance.close();
              Notification({
                  message: 'Factura Anulada Correctamente!',
                  title: 'Factura Anulada',
                  delay: 5000,
                  positionX: 'center',
                  positionY: 'top'
              }, 'info');
          });
    };

    $scope.buscarNCF = function(index) {
        secuenciasFac.get(index).success(function(response){
            $scope.prefijoNCF = response.secuencia_prefijo;
            $scope.nota_credito.nota_credito_ncf = response.secuencia_actual;
        })
    }

    $scope.buscarNCF(5);

    $scope.generarNotadeCredito = function () {
        $scope.nota_credito.paciente_id = $scope.factura.paciente_id;
        $scope.nota_credito.nota_credito_fecha = new Date();
        $scope.nota_credito.nota_credito_fecha = $filter('date')($scope.nota_credito.nota_credito_fecha,'yyyy-MM-dd HH:mm:ss');        
        $scope.nota_credito.nota_credito_ncf = $scope.prefijoNCF + $filter('minLength')($scope.nota_credito.nota_credito_ncf, 8);
        $scope.nota_credito.usuario_id = $rootScope.user.id;
        $scope.nota_credito.factura_id = $scope.factura.id;
        $scope.nota_credito.factura_numero = $scope.factura.factura_numero;
        $scope.nota_credito.factura_ncf = $scope.factura.factura_ncf;
        console.log($scope.nota_credito);

        notasdeCreditoFac.save($scope.nota_credito, Id)
        .then(
            function(response){
                console.log("nota de credito registrada!");
                console.log(response);
                console.log($scope.nota_credito);
                notasdeCreditoFac.get(parseInt(response.data.id,10))
                .success(function(data) {
                    d = new Date(data.nota_credito_fecha);
                    data.nota_credito_fecha = d;
                    console.log(data);
                    $scope.nota_credito = data;
                    $timeout(function() {
                        var el = document.getElementById('printElement');
                        angular.element(el).triggerHandler('click');                    
                        $state.reload();
                        console.log("State Changed");
                        Notification({
                            message: 'Nota de Crédito Generada Correctamente!',
                            title: 'Nota de Crédito',
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
                console.log($scope.nota_credito);
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
        )
    };          

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.calcular = function(index) {
        console.log($scope.factura.detalle_facturas[0].servicio_precio);
        var precio = $scope.factura.detalle_facturas[0].servicio_precio;
        if (index == 1) {
            if($scope.nota_credito.nota_credito_cantidad) {
                $scope.nota_credito.nota_credito_monto = $scope.nota_credito.nota_credito_cantidad * precio;
            }
            else {
                $scope.nota_credito.nota_credito_monto = "";
            }
            console.log($scope.nota_credito.nota_credito_monto);            
        }
        else {
            if($scope.nota_credito.nota_credito_monto) {
                var cantidad = parseFloat($scope.nota_credito.nota_credito_monto / precio).toFixed(2);
                $scope.nota_credito.nota_credito_cantidad = parseFloat(cantidad);
            }
            else {
                $scope.nota_credito.nota_credito_cantidad = "";
            }
            console.log($scope.nota_credito.nota_credito_cantidad);                        
        }
    }    

    $scope.printDiv = function (divName) {

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
    
}])
  
app.controller('FacturasCtrl', ['$rootScope', '$scope', '$filter', '$uibModal', '$stateParams', '$timeout', '$state', 'Notification', 'facturas', 'facturasFac', 'Auth', function ($rootScope, $scope, $filter, $modal, $stateParams, $timeout, $state, Notification, facturas, facturasFac, Auth) {
    
    $scope.loading = true;

    Auth.getLoggedInUser();
    $scope.perfil_usuario = $rootScope.user.perfil_usuario_id;
    console.log(facturas);
    $scope.facturas = facturas.data;
    console.log($scope.facturas);
    var a = 1;
    if ($scope.perfil_usuario == 1) {
        $scope.tbOptions = {
            data: $scope.facturas,
            aoColumns: [
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return a++; }
                },
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return '<a class="text-center" onclick="openModalFacturaDetalle('+ o.id + ')">'+o.factura_numero+'</a>'; }
                },                
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return '<a class="text-center" href="#/app/pacientes/perfil/'+ o.paciente.id + '">'+o.paciente.persona.persona_nombres+' '+ o.paciente.persona.persona_apellidos +'</a>'; }
                },
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return $filter('date')(new Date(o.factura_fecha),'dd-MMM-yyyy'); }
                },
                { mData: 'factura_tipo' },
                { mData: 'factura_total' },
                { mData: 'estado.estado_nombre' },
                {
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<div class="text-center"><button title="Generar nota de cr&eacute;dito" class="btn btn-xs btn-primary ng-click-active" onclick="openModalNotaCredito('+ o.id + ')"><i class="fa fa-credit-card"></i></button>&nbsp;<button title="Reimprimir factura" class="btn btn-xs btn-success ng-click-active" onclick="openModalFacturaDetalle('+ o.id + ')"><i class="fa fa-print"></i></button>&nbsp;<button title="Anular factura" class="btn btn-xs btn-danger ng-click-active" onclick="openModalAnularFactura('+ o.id + ')"><i class="fa fa-times-circle"></i></button></div>'; }
                }
            ]
        }        
    }
    else {
        $scope.tbOptions = {
            data: $scope.facturas,
            aoColumns: [
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return a++; }
                },
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return '<a class="text-center" onclick="openModalFacturaDetalle('+ o.id + ')">'+o.factura_numero+'</a>'; }
                },                
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return '<a class="text-center" href="#/app/pacientes/perfil/'+ o.paciente.id + '">'+o.paciente.persona.persona_nombres+' '+ o.paciente.persona.persona_apellidos +'</a>'; }
                },
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return $filter('date')(new Date(o.factura_fecha),'dd-MMM-yyyy'); }
                },
                { mData: 'factura_tipo' },
                { mData: 'factura_total' },
                { mData: 'estado.estado_nombre' },
                {
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<div class="text-center"><button title="Generar nota de cr&eacute;dito" class="btn btn-xs btn-primary ng-click-active" onclick="openModalNotaCredito('+ o.id + ')"><i class="fa fa-credit-card"></i></button>&nbsp;<button title="Reimprimir factura" class="btn btn-xs btn-success ng-click-active" onclick="openModalFacturaDetalle('+ o.id + ')"><i class="fa fa-print"></i></button></div>'; }
                }
            ]
        }        
    }

    $scope.loading = false;
    
    $scope.generarNotaCredito = function (size,windowClass,Id) {
      var modalInstance = $modal.open({
        templateUrl: 'templates/modal-notaCredito.html',
        controller: 'ModalInstanceFacturasCtrl',
        windowClass: windowClass,
        size: size,
        resolve: {
            Id: function () {
            return Id;
         }
       }          
      });

      modalInstance.result.then(function () {
          $state.reload(); 
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.anularFactura = function (size,windowClass,Id) {
      var modalInstance = $modal.open({
        templateUrl: 'templates/modal-facturaAnular.html',
        controller: 'ModalInstanceFacturasCtrl',
        windowClass: windowClass,
        size: size,
        resolve: {
            Id: function () {
            return Id;
         }
       }          
      });

      modalInstance.result.then(function () {
          $state.reload(); 
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };
    
    $scope.facturaDetalle = function (size,windowClass,Id) {
      var modalInstance = $modal.open({
        templateUrl: 'templates/modal-facturaDetalle.html',
        controller: 'ModalInstanceFacturasCtrl',
        windowClass: windowClass,
        size: size,
        resolve: {
            Id: function () {
            return Id;
         }
       }          
      });

      modalInstance.result.then(function () {
          $state.reload(); 
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };
    
}]);

function openModalNotaCredito(Id) {
    angular.element(document.getElementById('FacturasTable')).scope().generarNotaCredito(null,null,Id);
}

function openModalAnularFactura(Id) {
    angular.element(document.getElementById('FacturasTable')).scope().anularFactura(null,null,Id);
}

function openModalFacturaDetalle(Id) {
    angular.element(document.getElementById('FacturasTable')).scope().facturaDetalle(null,null,Id);
}