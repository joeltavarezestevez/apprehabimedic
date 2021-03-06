app.controller('ModalInstanceConsultasCtrl', ['$scope', '$filter', '$uibModalInstance', 'Id', 'consultasFac', function($scope, $filter, $modalInstance, Id, consultasFac) {

    $scope.registro = {};
    
    consultasFac.get(parseInt(Id,10))
    .success(function(data) {
        $scope.registro = data;
        $scope.registro.nombres = 'la consulta del ' + $filter('date')(data.consulta_fecha,'dd-MM-yyyy') + ' del paciente ' + data.paciente.persona.persona_nombres+' '+ data.paciente.persona.persona_apellidos;
    });   
    
    $scope.ok = function (Id) {
        $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    
  }])
  
app.controller('ConsultasCtrl', ['$rootScope', '$scope', '$filter', '$uibModal', '$stateParams', '$timeout', '$state', 'Notification', 'consultas', 'consultasFac', 'Auth', function ($rootScope, $scope, $filter, $modal, $stateParams, $timeout, $state, Notification, consultas, consultasFac, Auth) {
    
    $scope.permiso = $rootScope.user.perfil_usuario_id;
    
    //Get All consultas
    $scope.consultas = consultas.data;
    console.log($scope.consultas);
	$scope.tbOptions = {
		data: $scope.consultas,
		aoColumns: [
			{ mData: 'consulta_id' },
			{
				mData: null,
				bSortable: true,
				mRender: function (o) { return '<a class="text-center" href="#/app/pacientes/perfil/'+ o.paciente_id + '">'+o.paciente_nombres+' '+ o.paciente_apellidos +'</a>'; }
			},
			{
				mData: null,
				bSortable: true,
				mRender: function (o) { return $filter('date')(o.consulta_fecha,'dd-MM-yyyy'); }
			},
			{
				mData: null,
				bSortable: true,
				mRender: function (o) { return o.usuario_nombres+' '+ o.usuario_apellidos; }
			},
			{
				mData: null,
				bSortable: false,
				mRender: function (o) { return '<div class="text-center"><a class="btn btn-xs btn-info" href="#/app/consultas/editar/'+ o.consulta_id + '"><i class="fa fa-pencil"></i></a>&nbsp;<button class="btn btn-xs btn-danger ng-click-active" onclick="openModalDeleteConsultas('+ o.consulta_id + ')"><i class="fa fa-trash"></i></button></div>'; }
			}
		]
	}
	
	$scope.loading = false;

    $scope.open = function (size,windowClass,Id) {
      var modalInstance = $modal.open({
        templateUrl: 'templates/modal-deleteConsultas.html',
        controller: 'ModalInstanceConsultasCtrl',
        windowClass: windowClass,
        size: size,
        resolve: {
            Id: function () {
            return Id;
         }
       }          
      });

      modalInstance.result.then(function () {
          consultasFac.delete(Id)
              .success(function(data) {
                $timeout(function() {
                  $state.reload(); 
                }, 1000, false);  

                Notification({
                    message: 'Consulta Eliminada Correctamente!',
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

function openModalDeleteConsultas(Id) {
    angular.element(document.getElementById('ConsultasTable')).scope().open(null,null,Id);
}