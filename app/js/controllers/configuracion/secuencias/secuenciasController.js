app.controller('SecuenciasCtrl', ['$scope', '$stateParams', '$timeout', '$state', 'Notification', 'secuencias', function ($scope, $stateParams, $timeout, $state, Notification, secuencias) {
    
    $scope.loading = true;
    
    //Get All Secuencias
    $scope.secuencias = secuencias.data;
    console.log($scope.secuencias);
    $scope.tbOptions = {
        data: $scope.secuencias,
        aoColumns: [
            { mData: 'id' },
            { mData: 'secuencia_descripcion' },
            { mData: 'secuencia_prefijo' },
            { mData: 'secuencia_actual' },
            { mData: 'secuencia_limite' },
            {
                mData: null,
                bSortable: false,
                mRender: function (o) { return '<div class="text-center"><a class="btn btn-xs btn-info" href="#/app/configuracion/secuencias/editar/'+ o.id + '"><i class="fa fa-pencil"></i></a></div>'; }
            }
        ]
    }
    
    $scope.loading = false;
    
}]);