app.controller('MessagesDropDownCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('data/messages.json').success(function(data) {
      $scope.messages = data;
    });
  }]);

app.controller('ModalInstanceCitasCtrl', ['$scope', '$filter', '$uibModalInstance', 'Id', 'citasFac', 'Notification', function($scope, $filter, $modalInstance, Id, citasFac, Notification) {
      
    $scope.registro = {};

    citasFac.get(parseInt(Id,10))
    .success(function(data) {
        d = new Date(data.cita_fecha_hora);
        data.cita_fecha_hora = d;
        $scope.fecha = $filter('date')(data.cita_fecha_hora, 'dd/MMM hh:mma');
        $scope.registro.nombres = 'de '+ data.paciente.persona.persona_nombres + ' ' + data.paciente.persona.persona_apellidos + ' en fecha: ' + $scope.fecha;
        console.log(data);
        $scope.cita = data;
    });
    
    $scope.ok = function (Id) {
        $modalInstance.close();
    };
    
    $scope.realizarCita = function() {
        $scope.cita.estado_id = 4;
        citasFac.update($scope.cita, Id)
            .then(
            function(data) {
                $modalInstance.close();
                Notification({
                    message: 'Cita Realizada Correctamente!',
                    title: 'Cita Realizada',
                    delay: 5000,
                    positionX: 'center',
                    positionY: 'top'
                }, 'success');
            }
        );
    }
    
    $scope.cancelarCita = function () {
      citasFac.cancelarCita($scope.cita, Id)
      .then(
      function(data) {
          $modalInstance.close();
          Notification({
              message: 'Cita Cancelada Correctamente!',
              title: 'Cita Cancelada',
              delay: 5000,
              positionX: 'center',
              positionY: 'top'
          }, 'info');
      });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };    
}])

app.controller('NotificationsDropDownCtrl', ['$scope', '$filter', '$state', '$uibModal', 'citasFac', 'Notification', function($scope, $filter, $state, $modal, terapiasFac, Notification) {
    
    $scope.terapias = [];
    $scope.registro = {};
      terapiasFac.all()
          .success(function(data) {
          console.log(data);
          for (var i = 0; i < data.length; i++) {
              if(data[i].estado_id == 1) {
                  data[i].terapia_sesion_fecha = new Date(data[i].terapia_sesion_fecha);
                  //if(data[i].terapia_sesion_fecha == new Date()) {
                      $scope.terapias.push(data[i]);
                  //}
              }
          }
      })
      
      console.log($scope.citas);
        
        $scope.cancelCita = function (size,windowClass,Id) {
            
            var modalInstance = $modal.open({
                templateUrl: 'templates/modal-cancelarCita.html',
                controller: 'ModalInstanceCitasCtrl',
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
        }
    
        $scope.doCita = function (size,windowClass,Id) {        
            var modalInstance = $modal.open({
                templateUrl: 'templates/modal-realizarCita.html',
                controller: 'ModalInstanceCitasCtrl',
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
        }
        
        $scope.deleteNotification =  function(notification) {
            $scope.notifications.splice($scope.notifications.indexOf(notification), 1);
            console.log('borrada');
        }
  }]);