app.controller('ModalInstancePlanesCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$uibModalInstance', 'Id', 'Notification', 'aseguradorasFac', 'planesAseguradorasFac', function($scope, $rootScope, $timeout, $state, $modalInstance, Id, Notification, aseguradorasFac, planesAseguradorasFac) {
      
    $scope.aseguradora = {};

    aseguradorasFac.get(parseInt(Id,10))
    .success(function(data) {
        $scope.aseguradora = data;
        console.log($scope.aseguradora);
    });   
    
    $scope.ok = function (Id) {
        $modalInstance.close();
    };
    
    $scope.agregarPlan = function() {
        $scope.plan.aseguradora_id = $scope.aseguradora.id;
        console.log($scope.plan);
        planesAseguradorasFac.save($scope.plan)
          .success(function(data) {
            $modalInstance.close();
            $timeout(function() {
              $state.reload(); 
            }, 1000, false);             
            Notification({
                message: 'Plan Agregado Correctamente!',
                title: 'Registro Realizado',
                delay: 5000,
                positionX: 'center',
                positionY: 'top'
            }, 'success');
        })
        .error(function(data) {
            console.log(data);
        })    
    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };    
}])

app.controller('AseguradorasDetalleCtrl', ['$scope', '$stateParams', '$window', '$timeout', '$state',  '$uibModal', 'Notification', 'aseguradorasFac', function($scope, $stateParams, $window, $timeout, $state, $modal, Notification, aseguradorasFac) {

    $scope.aseguradora = {};

    aseguradorasFac.get(parseInt($stateParams.id,10))
    .then(
        function(response){
            $scope.aseguradora = response.data;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );
    
    $scope.save = function() {
        $scope.aseguradora.estado_id = 1;
        aseguradorasFac.save($scope.aseguradora)
        .then(
            function(response){
                console.log("Aseguradora registrada!");
                console.log(response);
                console.log($scope.aseguradora);
                $timeout(function() {
                    $state.go('app.aseguradoras');
                    console.log("State Changed");
                    Notification({
                        message: 'Aseguradora registrada correctamente!',
                        title: 'Registro realizado',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'success');                    
                }, 1000, false);
            },
            function(response){
                console.log("Error");
                console.log(response);
                console.log($scope.aseguradora);
            }
        );
    }
    
    $scope.update = function() {
        aseguradorasFac.update($scope.aseguradora, parseInt($stateParams.id,10))
        .then(
            function(response){
                console.log("Aseguradora actualizada!");
                console.log(response);
                console.log($scope.aseguradora);
                $timeout(function() {
                    $state.go('app.aseguradoras');
                    console.log("State Changed");
                    Notification({
                        message: 'Aseguradora actualizada correctamente!',
                        title: 'Registro Actualizado',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'info');                    
                }, 1000, false);
            },
            function(response){
                console.log("Error");
                console.log(response);
                console.log($scope.aseguradora);
            }
        );
    }
    
    $scope.back = function() {
        $window.history.back();
    }   

    $scope.agregarPlan = function (size,windowClass,Id) {
      var modalInstance = $modal.open({
        templateUrl: 'templates/modal-agregarPlanAseguradora.html',
        controller: 'ModalInstancePlanesCtrl',
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
}])
