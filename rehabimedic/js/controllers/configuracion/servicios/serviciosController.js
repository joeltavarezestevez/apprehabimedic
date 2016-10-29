app.controller('ServiciosCtrl', ['$scope', '$stateParams', '$timeout', '$state', 'Notification', 'servicios', function ($scope, $stateParams, $timeout, $state, Notification, servicios) {
    
    $scope.loading = true;
    
    //Get All Secuencias
    $scope.servicios = servicios.data;
    console.log($scope.servicios);
    $scope.tbOptions = {
        data: $scope.servicios,
        aoColumns: [
            { mData: 'id' },
            { mData: 'servicio_nombre' },
            { mData: 'servicio_costo' },
            { mData: 'servicio_precio' },
            {
                mData: null,
                bSortable: false,
                mRender: function (o) { return '<div class="text-center"><a class="btn btn-xs btn-info" href="#/app/configuracion/servicios/editar/'+ o.id + '"><i class="fa fa-pencil"></i></a></div>'; }
            }
        ]
    }
    
    $scope.loading = false;
    
}]);