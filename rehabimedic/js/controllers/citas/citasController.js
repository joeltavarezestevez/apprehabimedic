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
        citasFac.realizarCita($scope.cita, Id)
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

app.controller('CitasCtrl', ['$scope', '$state', '$uibModal', 'citasFac', 'Notification', function($scope, $state, $modal, citasFac, Notification) {
    
    $scope.events = [];
    
    //Get All Citas
    citasFac.all()
    .success(function(data) {
        $scope.citas = data;
        console.log($scope.citas);
        for (var i = 0; i < $scope.citas.length; i++) {
            if($scope.citas[i].estado_id == 1){
                var date = new Date($scope.citas[i].cita_fecha_hora);
                $scope.citas[i].cita_fecha_hora = new Date($scope.citas[i].cita_fecha_hora);
                var y = date.getFullYear();
                var m = date.getMonth();            
                var d = date.getDate();
                var h = date.getHours();
                var min = date.getMinutes();
                var event = {};
                event = {
                    title: $scope.citas[i].paciente.persona.persona_nombres + " " + $scope.citas[i].paciente.persona.persona_apellidos,
                    stick : true,
                    start: new Date(y, m, d, h, min),
                    end: new Date(y, m, d, h, min + 30)
                };
                $scope.events.push(event);                
            }
        }
        console.log($scope.events);
    });

    /* event source that pulls from google.com */
    $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Santo_Domingo' // an option!
    };
    
    /* alert on dayClick */
    $scope.precision = 400;
    $scope.lastClickTime = 0;
    
    
    /* config object */
    $scope.uiConfig = {
      calendar:{
        lang: 'es',
        timeFormat:'hh:mma',
        height: 700,
        editable: false,
        header:{
          left: 'prev',
          center: 'title',
          right: 'next'
        }
      }
    };

    /* Change View */
    $scope.changeView = function(view, calendar) {
      $('.calendar').fullCalendar('changeView', view);
    };

    $scope.today = function(calendar) {
      $('.calendar').fullCalendar('today');
    };

    /* event sources array*/
    $scope.eventSources = [$scope.events];

    $scope.open = function (size,windowClass,Id) {
      var modalInstance = $modal.open({
        templateUrl: 'templates/modal-delete.html',
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
          citasFac.delete(Id)
              .success(function(data) {
                Notification({
                    message: 'Cita Eliminada Correctamente!',
                    title: 'Registro Eliminado',
                    delay: 5000,
                    positionX: 'center',
                    positionY: 'top'
                }, 'error');
              $state.reload(); 
          });
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };
    
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
    };
    
    $scope.realizarCita = function (size,windowClass,Id) {
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
    };    
    
}]);