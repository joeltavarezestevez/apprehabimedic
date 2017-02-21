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

app.controller('NotificationsDropDownCtrl', ['$scope', '$filter', '$state', '$uibModal', 'terapiasFac', 'Notification', function($scope, $filter, $state, $modal, terapiasFac, Notification) {
    
    $scope.terapias = [];
    $scope.registro = {};
    var d = new Date();
    d.setDate(d.getDate() - 2);
    //d = $moment(date,"H:i m/d/Y").fromNow()
    console.log(d);
      terapiasFac.all()
        .success(function(data) {
          console.log(data);
          //console.log(data[0].pacientes_terapias_detalle);
          //console.log(data[0].pacientes_terapias_detalle[data[0].pacientes_terapias_detalle.length-1].terapia_sesion_fecha);
          for (var i = 0; i < data.length; i++) {
            if(data[i].estado_id == 1) {
              var j = data[i].pacientes_terapias_detalle.length - 1;
              console.log(data[i].pacientes_terapias_detalle[j]);
              data[i].pacientes_terapias_detalle[j].terapia_sesion_fecha = new Date(data[i].pacientes_terapias_detalle[j].terapia_sesion_fecha);
              data[i].pacientes_terapias_detalle[j].terapia_sesion_fecha.setDate(data[i].pacientes_terapias_detalle[j].terapia_sesion_fecha.getDate()+1);
              if(data[i].pacientes_terapias_detalle[j].terapia_sesion_fecha <= d) {
                var terapiavencida = data[i].pacientes_terapias_detalle[j];
                terapiavencida.paciente = data[i].paciente;
                terapiavencida.terapia_sesiones = data[i].terapia_sesiones;
                terapiavencida.terapias_realizadas = data[i].pacientes_terapias_detalle.length;
                console.log(terapiavencida);
                $scope.terapias.push(terapiavencida);
              }
            }
          }
        })
      
      console.log($scope.terapias);
        
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