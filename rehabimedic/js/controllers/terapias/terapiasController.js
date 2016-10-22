app.controller('ModalInstanceTerapiasCtrl', ['$scope', '$uibModalInstance', 'Id', 'terapiasFac', function($scope, $modalInstance, Id, terapiasFac) {

    $scope.registro = {};
    
    pacientesFac.get(parseInt(Id,10))
    .success(function(data) {
        $scope.registro = data;
        console.log($scope.registro);
    });   
    
    $scope.ok = function (Id) {
        $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    
  }])
  
app.controller('TerapiasCtrl', ['$rootScope', '$scope', '$uibModal', '$stateParams', '$timeout', '$filter', '$state', 'Notification', 'terapiasFac', 'Auth', function ($rootScope, $scope, $modal, $stateParams, $timeout, $filter, $state, Notification, terapiasFac, Auth) {
    
    $scope.loading = true;
    
    Auth.getLoggedInUser();
    $scope.permiso = $rootScope.user.perfil_usuario_id;
    //$scope.permiso = 3;
    console.log($scope.permiso);
    
    //Get All Pacientes
    terapiasFac.all()
    .success(function(data) {
        $scope.terapias = data;
        console.log($scope.terapias);
        $scope.tbOptions = {
            data: $scope.terapias,
            aoColumns: [
                { mData: 'id' },                              
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return '<a ng-hide="perfil_usuario!=2 || perfil_usuario!=1" class="text-center" href="#/app/pacientes/perfil/'+ o.id + '">'+o.paciente.persona.persona_nombres+' '+ o.paciente.persona.persona_apellidos +'</a>'; }
                },   
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return $filter('date')(o.paciente_terapia_fecha,'dd-MM-yyyy'); }
                },
                {
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<div class="text-center"><a class="btn btn-xs btn-info" href="#/app/terapias/editar/'+ o.id + '"><i class="fa fa-pencil"></i></a>&nbsp;<button class="btn btn-xs btn-danger ng-click-active" onclick="openModalDeleteTerapias('+ o.id + ')"><i class="fa fa-trash"></i></button></div>'; }
                }
            ]
        }
        
        $scope.loading = false;
    })
    
    $scope.open = function (size,windowClass,Id) {
      var modalInstance = $modal.open({
        templateUrl: 'templates/modal-deleteTerapias.html',
        controller: 'ModalInstanceTerapiasCtrl',
        windowClass: windowClass,
        size: size,
        resolve: {
            Id: function () {
            return Id;
         }
       }          
      });

      modalInstance.result.then(function () {
          pacientesFac.delete(Id)
              .success(function(data) {
                $timeout(function() {
                  $state.reload(); 
                }, 1000, false);  

                Notification({
                    message: ' Terapia Eliminada Correctamente!',
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

function openModalDeleteTerapias(Id) {
    angular.element(document.getElementById('TerapiasTable')).scope().open(null,null,Id);
}