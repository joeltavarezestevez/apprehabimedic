app.controller('ModalInstanceUsuariosCtrl', ['$scope', '$uibModalInstance', '$timeout', 'Id', 'Notification', 'usuariosFac', function($scope, $modalInstance, $timeout, Id, Notification, usuariosFac) {
      
    $scope.registro = {};

    usuariosFac.get(parseInt(Id,10))
    .success(function(data) {
        $scope.registro.nombres = data.usuario_nombre;
        $scope.usuario = data;
        console.log($scope.registro);
    });   
    
    $scope.ok = function (Id) {
        $modalInstance.close();
    };
    
    $scope.closeAlert = function() {
        $scope.alert = false;
        console.log($scope.alert);
    }
    
    
    $scope.cambiar = function() {
      usuariosFac.updatePassword($scope.usuario, Id)
          .then(
          function(data) {
            $timeout(function() {
              $modalInstance.close();
            }, 1000, false);  
            Notification({
                message: 'Contraseña Cambiada Correctamente!',
                title: 'Contraseña Cambiada',
                delay: 5000,
                positionX: 'center',
                positionY: 'top'
            }, 'info');
          },
          function(response) {
              console.log("Error");
              console.log(response);
              console.log($scope.usuario);
              if(response.status == 400 && response.data.message){
                  console.log('Errol manin!');
                  $scope.alert = true;
                  $scope.mensajes = response.data.message;
              }
          }          
      );
    }
    
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };    
}])
  
app.controller('UsuariosCtrl', ['$scope', '$uibModal', '$stateParams', '$timeout', '$state', 'Notification', 'usuariosFac', function ($scope, $modal, $stateParams, $timeout, $state, Notification, usuariosFac) {
    
    $scope.loading = true;
   
    //Get All Pacientes
    usuariosFac.all()
    .success(function(data) {
        $scope.usuarios = data;
        console.log($scope.usuarios);
        $scope.tbOptions = {
            data: $scope.usuarios,
            aoColumns: [
                { mData: 'id' },
                {
                    mData: null,
                    bSortable: true,
                    mRender: function (o) { return o.persona.persona_nombres+' '+ o.persona.persona_apellidos; }
                },
                { mData: 'usuario_nombre' },
                { mData: 'persona.persona_correo_electronico' },
                { mData: 'perfil_usuario.perfil_usuario_nombre' },
                {   
                    mData: null,
                    bSortable: false,
                    mRender: function (o) { return '<div class="text-center"><a class="btn btn-xs btn-info" href="#/app/usuarios/editar/'+ o.id + '"><i class="fa fa-pencil"></i></a>&nbsp;<button class="btn btn-xs btn-danger ng-click-active" onclick="openModalDeleteUsuarios('+ o.id + ')"><i class="fa fa-trash"></i></button>&nbsp;<button alt="Cambiar Contrase&ntilde;a" class="btn btn-xs btn-accent ng-click-active" onclick="openModalContrasena('+ o.id + ')"><i class="fa fa-lock"></i></button></div>'; }
                }
            ]
        }
        
        $scope.loading = false;
    })
    
    $scope.open = function (size,windowClass,Id) {
      var modalInstance = $modal.open({
        templateUrl: 'templates/modal-deleteUsuarios.html',
        controller: 'ModalInstanceUsuariosCtrl',
        windowClass: windowClass,
        size: size,
        resolve: {
            Id: function () {
            return Id;
         }
       }          
      });
        
      modalInstance.result.then(function () {
          usuariosFac.delete(Id)
              .success(function(data) {
                $timeout(function() {
                  $state.reload(); 
                }, 1000, false);  
                Notification({
                    message: 'Usuario Eliminado Correctamente!',
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
        
    $scope.openModalContrasena = function (size,windowClass,Id) {
      var modalInstance = $modal.open({
          templateUrl: 'templates/modal-contrasena.html',
          controller: 'ModalInstanceUsuariosCtrl',
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
    };        
}]);

function openModalDeleteUsuarios(Id) {
    angular.element(document.getElementById('UsuariosTable')).scope().open(null,null,Id);
}

function openModalContrasena(Id) {
    angular.element(document.getElementById('UsuariosTable')).scope().openModalContrasena(null,null,Id);
}