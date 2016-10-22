app.controller('ModalInstanceAseguradorasCtrl', ['$scope', '$uibModalInstance', 'Id', 'aseguradorasFac', function($scope, $modalInstance, Id, aseguradorasFac) {

    $scope.registro = {};
    
    aseguradorasFac.get(parseInt(Id,10))
    .success(function(data) {
        $scope.registro = data;
        $scope.registro.nombres = data.aseguradora_nombre;
        console.log($scope.registro);
    });   
    
    $scope.ok = function (Id) {
        $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    
  }])
  
app.controller('AseguradorasCtrl', ['$scope', '$uibModal', '$stateParams', '$timeout', '$state', 'Notification', 'aseguradorasFac', function ($scope, $modal, $stateParams, $timeout, $state, Notification, aseguradorasFac) {
    
    $scope.loading = true;
    
    //Get All Aseguradoras
    aseguradorasFac.all()
    .success(function(data) {
        $scope.aseguradoras = data;
        console.log($scope.aseguradoras);
        $scope.tbOptions = {
            data: $scope.aseguradoras,
            aoColumns: [
                { mData: 'id' },
                { mData: 'aseguradora_nombre' },
                {
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<div class="text-center"><a class="btn btn-xs btn-info" href="#/app/aseguradoras/editar/'+ o.id + '"><i class="fa fa-pencil"></i></a>&nbsp;<button class="btn btn-xs btn-danger ng-click-active" onclick="openModalDeleteAseguradoras('+ o.id + ')"><i class="fa fa-trash"></i></button></div>'; }
                }
            ]
        }
        
        $scope.loading = false;
    })
    
    $scope.open = function (size,windowClass,Id) {
      var modalInstance = $modal.open({
        templateUrl: 'templates/modal-deleteAseguradoras.html',
        controller: 'ModalInstanceAseguradorasCtrl',
        windowClass: windowClass,
        size: size,
        resolve: {
            Id: function () {
            return Id;
         }
       }          
      });

      modalInstance.result.then(function () {
          aseguradorasFac.delete(Id)
              .success(function(data) {
                $timeout(function() {
                  $state.reload(); 
                }, 1000, false);  

                Notification({
                    message: 'Aseguradora Eliminada Correctamente!',
                    title: 'Registro Eliminado',
                    delay: 5000,
                    positionX: 'center',
                    positionY: 'top'
                }, 'error');
          });
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };
}]);

function openModalDeleteAseguradoras(Id) {
    angular.element(document.getElementById('AseguradorasTable')).scope().open(null,null,Id);
}