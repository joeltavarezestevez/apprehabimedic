app.controller('ModalInstanceFacturasCtrl', ['$scope', '$filter', '$uibModalInstance', 'Id', 'Notification', 'facturasFac', 'getRNCFac', function($scope, $filter, $modalInstance, Id, Notification, facturasFac, getRNCFac) {

    $scope.registro = {};
    
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

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

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
  
app.controller('FacturasCtrl', ['$rootScope', '$scope', '$filter', '$uibModal', '$stateParams', '$timeout', '$state', 'Notification', 'facturas', 'facturasFac', 'getRNCFac', 'Auth', function ($rootScope, $scope, $filter, $modal, $stateParams, $timeout, $state, Notification, facturas, facturasFac, getRNCFac, Auth) {
    
    $scope.loading = true;
    
    getRNCFac.get(130674779)
    .success(function(response){
        console.log(response);
    })
    .error(function(response){
        console.log(response);
    })

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
                    mRender: function (o) { return '<div class="text-center"><button class="btn btn-xs btn-success ng-click-active" onclick="openModalFacturaDetalle('+ o.id + ')"><i class="fa fa-print"></i></button>&nbsp;<button class="btn btn-xs btn-danger ng-click-active" onclick="openModalAnularFactura('+ o.id + ')"><i class="fa fa-times-circle"></i></button></div>'; }
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
                    mRender: function (o) { return '<div class="text-center"><button class="btn btn-xs btn-success ng-click-active" onclick="openModalFacturaDetalle('+ o.id + ')"><i class="fa fa-print"></i></button></div>'; }
                }
            ]
        }        
    }

    $scope.loading = false;
    
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

function openModalAnularFactura(Id) {
    angular.element(document.getElementById('FacturasTable')).scope().anularFactura(null,null,Id);
}

function openModalFacturaDetalle(Id) {
    angular.element(document.getElementById('FacturasTable')).scope().facturaDetalle(null,null,Id);
}