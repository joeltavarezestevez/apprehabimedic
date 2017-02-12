app.controller('ModalInstanceDoctoresCtrl', ['$scope', '$uibModalInstance', 'Id', 'doctoresFac', function($scope, $modalInstance, Id, doctoresFac) {
      
    $scope.registro = {};

    doctoresFac.get(parseInt(Id,10))
    .success(function(data) {
        $scope.registro = data;
        $scope.registro.nombres = data.persona.persona_nombres + " " + data.persona.persona_apellidos;
        console.log($scope.registro);
    });  
    
    $scope.ok = function (Id) {
        $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };   
    
  }])
  
app.controller('DoctoresCtrl', ['$scope', '$uibModal', '$stateParams', '$timeout', '$state', 'Notification', 'doctoresFac', 'doctores', function ($scope, $modal, $stateParams, $timeout, $state, Notification, doctoresFac, doctores) {
    
    $scope.loading = true;
    
    //Get all doctores
    $scope.doctores = doctores.data;
    console.log($scope.doctores);
    $scope.tbOptions = {
        data: $scope.doctores,
        aoColumns: [
            { mData: 'id'},                
            {
                mData: null,
                bSortable: false,
                mRender: function (o) { return '<a class="text-center preview" href="#/app/doctores/perfil/'+ o.id + '"><i class="fa fa-image"></i><span><img src="'+o.persona.persona_imagen_perfil+'" class="hide-image" height="70" /></span></div>'; }
            },                    
            {
                mData: null,
                bSortable: true,
                mRender: function (o) { return '<a class="text-center" href="#/app/doctores/perfil/'+ o.id + '">'+o.persona.persona_nombres+' '+o.persona.persona_apellidos+'</a>'; }
            },
            { mData: 'persona.personas_telefonos.0.telefono_numero' },   
            { mData: 'persona.persona_correo_electronico' },            
            { mData: 'especialidad.especialidad_nombre' },
            {
                mData: null,
                bSortable: false,
                mRender: function (o) { return '<div class="text-center"><a class="btn btn-xs btn-info" href="#/app/doctores/editar/'+ o.id + '"><i class="fa fa-pencil"></i></a>&nbsp;<button class="btn btn-xs btn-danger ng-click-active" onclick="openModalDeleteDoctores('+ o.id + ')"><i class="fa fa-trash"></i></button></div>'; }
            }
        ]
    }
    
    $scope.loading = false;
    
    $scope.open = function (size,windowClass,Id) {
      var modalInstance = $modal.open({
        templateUrl: 'templates/modal-deleteDoctores.html',
        controller: 'ModalInstanceDoctoresCtrl',
        windowClass: windowClass,
        size: size,
        resolve: {
            Id: function () {
            return Id;
         }
       }          
      });

      modalInstance.result.then(function () {
          doctoresFac.delete(Id)
              .success(function(data) {
                $timeout(function() {
                  $state.reload(); 
                }, 1000, false);  

                Notification({
                    message: 'Doctor Eliminado Correctamente!',
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

function openModalDeleteDoctores(Id) {
    angular.element(document.getElementById('DoctoresTable')).scope().open(null,null,Id);
}
