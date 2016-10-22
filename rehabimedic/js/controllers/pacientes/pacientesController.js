app.controller('ModalInstancePacientesCtrl', ['$scope', '$uibModalInstance', 'Id', 'pacientesFac', function($scope, $modalInstance, Id, pacientesFac) {
      
    $scope.registro = {};

    pacientesFac.get(parseInt(Id,10))
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
  
app.controller('PacientesCtrl', ['$scope', '$uibModal', '$stateParams', '$timeout', '$state', 'Notification', 'pacientesFac', function ($scope, $modal, $stateParams, $timeout, $state, Notification, pacientesFac) {
    
    $scope.loading = true;
   
    //Get All Pacientes
    pacientesFac.all()
    .success(function(data) {
        $scope.pacientes = data;
        console.log($scope.pacientes);
        $scope.tbOptions = {
            data: $scope.pacientes,
            aoColumns: [
                { mData: 'id' },                
                {
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<a ng-hide="perfil_usuario!=2 || perfil_usuario!=1" class="text-center preview" href="#/app/pacientes/perfil/'+ o.id + '"><i class="fa fa-image"></i><span><img src="'+o.persona.persona_imagen_perfil+'" class="hide-image" height="100" /></span></div>'; }
                },
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return '<a ng-hide="perfil_usuario!=2 || perfil_usuario!=1" class="text-center" href="#/app/pacientes/perfil/'+ o.id + '">'+o.persona.persona_nombres+' '+ o.persona.persona_apellidos +'</a>'; }
                },
                { mData: 'persona.personas_telefonos.0.telefono_numero' },
                { mData: 'persona.persona_correo_electronico' },
                { mData: 'paciente_balance' },
                {   
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<div class="text-center"><a class="btn btn-xs btn-info" href="#/app/pacientes/editar/'+ o.id + '"><i class="fa fa-pencil"></i></a>&nbsp;<button class="btn btn-xs btn-danger ng-click-active" onclick="openModalDeletePacientes('+ o.id + ')"><i class="fa fa-trash"></i></button></div>'; }
                }
            ]
        }
        
        $scope.loading = false;
    })
    
    $scope.open = function (size,windowClass,Id) {
      var modalInstance = $modal.open({
        templateUrl: 'templates/modal-deletePacientes.html',
        controller: 'ModalInstancePacientesCtrl',
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
                    message: 'Paciente Eliminado Correctamente!',
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

function openModalDeletePacientes(Id) {
    angular.element(document.getElementById('PacientesTable')).scope().open(null,null,Id);
}