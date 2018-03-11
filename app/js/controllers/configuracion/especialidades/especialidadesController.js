app.controller('EspecialidadesCtrl', ['$scope', '$stateParams', '$timeout', '$state', 'Notification', 'especialidades', function ($scope, $stateParams, $timeout, $state, Notification, especialidades) {
    
    $scope.loading = true;
    
    //Get All especialidades
    $scope.especialidades = especialidades.data;
    console.log($scope.especialidades);
    $scope.tbOptions = {
        data: $scope.especialidades,
        aoColumns: [
            { mData: 'id' },
            { mData: 'especialidad_nombre' },
            {
                mData: null,
                bSortable: false,
                mRender: function (o) { return '<div class="text-center"><a class="btn btn-xs btn-info" href="#/app/configuracion/especialidades/editar/'+ o.id + '"><i class="fa fa-pencil"></i></a></div>'; }
            }
        ]
    }
    
    $scope.loading = false;
    
}]);