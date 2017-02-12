app.controller('ModalInstancePagosCtrl', ['$scope', '$filter', '$uibModalInstance', 'Id', 'pagosFac', function($scope, $filter, $modalInstance, Id, pagosFac) {

    $scope.registro = {};
    
    pagosFac.get(parseInt(Id,10))
    .success(function(data) {
        d = new Date(data.pago_fecha);
        data.pago_fecha = d;
        $scope.fecha = $filter('date')(data.pago_fecha, 'dd/MMM hh:mma');
        $scope.registro.nombres = 'el pago del paciente '+ data.paciente.persona.persona_nombres + ' ' + data.paciente.persona.persona_apellidos + ' en fecha: ' + $scope.fecha;
        console.log(data);
        $scope.pago = data;
    });   
    
    $scope.anularPago = function () {
      pagosFac.anularPago($scope.pago, Id)
          .then(
          function(data) {
              $modalInstance.close();
              Notification({
                  message: 'Pago Anulado Correctamente!',
                  title: 'Pago Anulado',
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
  
app.controller('PagosCtrl', ['$rootScope', '$scope', '$filter', '$uibModal', '$stateParams', '$timeout', '$state', 'Notification', 'pagos', 'pagosFac', 'Auth', function ($rootScope, $scope, $filter, $modal, $stateParams, $timeout, $state, Notification, pagos, pagosFac, Auth) {
    
    $scope.loading = true;
    
    Auth.getLoggedInUser();
    $scope.perfil_usuario = $rootScope.user.perfil_usuario_id;
    console.log(pagos);
    $scope.pagos = pagos.data;
    console.log($scope.pagos);
    var a = 1;
    if($scope.perfil_usuario == 1) {
        $scope.tbOptions = {
            data: $scope.pagos,
            aoColumns: [
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return a++; }
                },
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return '<a class="text-center" onclick="openModalPagoDetalle('+ o.id + ')">'+ $filter('minLength')(o.id, 8) +'</a>'; }
                },                
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return '<a class="text-center" href="#/app/pacientes/perfil/'+ o.paciente.id + '">'+o.paciente.persona.persona_nombres+' '+ o.paciente.persona.persona_apellidos +'</a>'; }
                },
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return $filter('date')(new Date(o.pago_fecha),'dd-MMM-yyyy'); }
                },
                { mData: 'pago_monto' },
                { mData: 'estado.estado_nombre' },
                {
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<div class="text-center"><button class="btn btn-xs btn-success ng-click-active" onclick="openModalPagoDetalle('+ o.id + ')"><i class="fa fa-print"></i></button>&nbsp;<button class="btn btn-xs btn-danger ng-click-active" onclick="openModalAnularPago('+ o.id + ')"><i class="fa fa-times-circle"></i></button></div>'; }
                }
            ]
        }        
    }
    else {
        $scope.tbOptions = {
            data: $scope.pagos,
            aoColumns: [
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return a++; }
                },
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return '<a class="text-center" onclick="openModalPagoDetalle('+ o.id + ')">'+ $filter('minLength')(o.id, 8) +'</a>'; }
                },                
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return '<a class="text-center" href="#/app/pacientes/perfil/'+ o.paciente.id + '">'+o.paciente.persona.persona_nombres+' '+ o.paciente.persona.persona_apellidos +'</a>'; }
                },
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return $filter('date')(new Date(o.pago_fecha),'dd-MMM-yyyy'); }
                },
                { mData: 'pago_monto' },
                { mData: 'estado.estado_nombre' },
                {
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<div class="text-center"><button class="btn btn-xs btn-success ng-click-active" onclick="openModalPagoDetalle('+ o.id + ')"><i class="fa fa-print"></i></button></div>'; }
                }
            ]
        }        
    }
    
    $scope.loading = false;
    
    $scope.anularPago = function (size,windowClass,Id) {
      var modalInstance = $modal.open({
        templateUrl: 'templates/modal-pagoAnular.html',
        controller: 'ModalInstancePagosCtrl',
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
    
    $scope.pagoDetalle = function (size,windowClass,Id) {
      var modalInstance = $modal.open({
        templateUrl: 'templates/modal-pagoDetalle.html',
        controller: 'ModalInstancePagosCtrl',
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

function openModalAnularPago(Id) {
    angular.element(document.getElementById('PagosTable')).scope().anularPago(null,null,Id);
}

function openModalPagoDetalle(Id) {
    angular.element(document.getElementById('PagosTable')).scope().pagoDetalle(null,null,Id);
}