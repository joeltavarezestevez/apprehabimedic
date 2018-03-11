app.controller('ModalInstancePacientesCtrl', ['$scope', '$rootScope','$uibModalInstance', 'Id', 'Notification', 'pacientesFac', 'pacientesNotasEspecialesFac', function($scope, $rootScope, $modalInstance, Id, Notification, pacientesFac, pacientesNotasEspecialesFac) {
      
    $scope.registro = {};

    pacientesFac.get(parseInt(Id,10))
    .success(function(data) {
        $scope.registro = data;
        $scope.registro.nombres = data.persona.persona_nombres + " " + data.persona.persona_apellidos;
        $scope.paciente = data;
        console.log($scope.registro);
    });   
    
    $scope.ok = function (Id) {
        $modalInstance.close();
    };
    
    $scope.agregarNota = function() {
        $scope.nota.paciente_id = $scope.paciente.id;
        $scope.nota.usuario_id = $rootScope.user.id;
        pacientesNotasEspecialesFac.save($scope.nota)
          .success(function(data) {
            $modalInstance.close();
            Notification({
                message: 'Nota Agregada Correctamente!',
                title: 'Registro Realizado',
                delay: 5000,
                positionX: 'center',
                positionY: 'top'
            }, 'success');
      });        
    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };    
}])
  
app.controller('PacientesCtrl', ['$scope', '$rootScope', '$uibModal', '$stateParams', '$timeout', '$state', 'Notification', 'pacientes', 'pacientesFac', function ($scope, $rootScope, $modal, $stateParams, $timeout, $state, Notification, pacientes, pacientesFac) {
    
    $scope.loading = true;
    $scope.perfil_usuario == $rootScope.user.perfil_usuario_id;
    console.log($scope.perfil_usuario);
   
    //Get All Pacientes
    $scope.pacientes = pacientes.data;
    console.log($scope.pacientes);
    if($scope.perfil_usuario == 1) {
        $scope.tbOptions = {
            data: $scope.pacientes,
            aoColumns: [
                { mData: 'id' },                
                {
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<a class="text-center preview" href="#/app/pacientes/perfil/'+ o.id + '"><i class="fa fa-image"></i><span><img src="'+o.persona_imagen_perfil+'" class="hide-image" height="70" /></span></div>'; }
                },
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return '<a class="text-center" href="#/app/pacientes/perfil/'+ o.id + '">'+o.persona_nombres+' '+ o.persona_apellidos +'</a>'; }
                },
                { mData: 'persona_telefono' },
				{ mData: 'referidor_nombre' },
                { mData: 'paciente_balance' },
                {   
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<div class="text-center"><button class="btn btn-xs btn-success ng-click-active" title="Agregar Nota" onclick="openModalAgregarNota('+ o.id + ')"><i class="fa fa-comments-o"></i></button>&nbsp;<a class="btn btn-xs btn-info" href="#/app/pacientes/editar/'+ o.id + '"><i class="fa fa-pencil"></i></a>&nbsp;<button class="btn btn-xs btn-danger ng-click-active" onclick="openModalDeletePacientes('+ o.id + ')"><i class="fa fa-trash"></i></button></div>'; }
                }
            ]
        }        
    }
    else if ($scope.perfil_usuario == 2) {
        $scope.tbOptions = {
            data: $scope.pacientes,
            aoColumns: [
                { mData: 'id' },                
                {
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<a class="text-center preview" href="#/app/pacientes/perfil/'+ o.id + '"><i class="fa fa-image"></i><span><img src="'+o.persona_imagen_perfil+'" class="hide-image" height="70" /></span></div>'; }
                },
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return '<a class="text-center" href="#/app/pacientes/perfil/'+ o.id + '">'+o.persona_nombres+' '+ o.persona_apellidos +'</a>'; }
                },
                { mData: 'persona_telefono' },				
				{ mData: 'referidor_nombre' },
                { mData: 'paciente_balance' },
                {   
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<div class="text-center"><button class="btn btn-xs btn-success ng-click-active" title="Agregar Nota" onclick="openModalAgregarNota('+ o.id + ')"><i class="fa fa-comments-o"></i></button>&nbsp;<a class="btn btn-xs btn-info" href="#/app/pacientes/editar/'+ o.id + '"><i class="fa fa-pencil"></i></a></div>'; }
                }
            ]
        }          
    }
    else if ($scope.perfil_usuario == 3) {
        $scope.tbOptions = {
            data: $scope.pacientes,
            aoColumns: [
                { mData: 'id' },                
                {
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<a class="text-center preview" href="#/app/pacientes/perfil/'+ o.id + '"><i class="fa fa-image"></i><span><img src="'+o.persona_imagen_perfil+'" class="hide-image" height="70" /></span></div>'; }
                },
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return '<a class="text-center" href="#/app/pacientes/perfil/'+ o.id + '">'+o.persona_nombres+' '+ o.persona_apellidos +'</a>'; }
                },
                { mData: 'persona.grupo_sanguineo_nombre' },
                { mData: 'persona.persona_edad' },
                { mData: 'persona.sexo_nombre' },
                {   
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<div class="text-center"><button class="btn btn-xs btn-success ng-click-active" title="Agregar Nota" onclick="openModalAgregarNota('+ o.id + ')"><i class="fa fa-comments-o"></i></button>&nbsp;<a class="btn btn-xs btn-info" href="#/app/pacientes/editar/'+ o.id + '"><i class="fa fa-pencil"></i></a></div>'; }
                }
            ]
        }
    }
    else {
        $scope.tbOptions = {
            data: $scope.pacientes,
            aoColumns: [
                { mData: 'id' },                
                {
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<a class="text-center preview" href="#/app/pacientes/perfil/'+ o.id + '"><i class="fa fa-image"></i><span><img src="'+o.persona_imagen_perfil+'" class="hide-image" height="70" /></span></div>'; }
                },
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return '<a class="text-center" href="#/app/pacientes/perfil/'+ o.id + '">'+o.persona_nombres+' '+ o.persona_apellidos +'</a>'; }
                },
                { mData: 'persona.grupo_sanguineo_nombre' },
                { mData: 'persona.persona_edad' },
                { mData: 'persona.sexo_nombre' },
                {   
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<div class="text-center"><button class="btn btn-xs btn-success ng-click-active" title="Agregar Nota" onclick="openModalAgregarNota('+ o.id + ')"><i class="fa fa-comments-o"></i></button></div>'; }
                }
            ]
        }
    }               

    $scope.loading = false;
    
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
            console.log(data);
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
          })
              .error(function(data) {
                console.log(data);
            });              
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }
    
    $scope.agregarNota = function (size,windowClass,Id) {
      var modalInstance = $modal.open({
        templateUrl: 'templates/modal-agregarNotaPaciente.html',
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
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }    
}]);

function openModalDeletePacientes(Id) {
    angular.element(document.getElementById('PacientesTable')).scope().open(null,null,Id);
}
function openModalAgregarNota(Id) {
    angular.element(document.getElementById('PacientesTable')).scope().agregarNota(null,null,Id);
}