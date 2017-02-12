app.controller('EnfermedadesCtrl', ['$scope', '$stateParams', '$timeout', '$state', 'Notification', 'enfermedades', function ($scope, $stateParams, $timeout, $state, Notification, enfermedades) {
    
    $scope.loading = true;
    
    //Get All Secuencias
    $scope.enfermedades = enfermedades.data;
    console.log($scope.enfermedades);
    $scope.tbOptions = {
        data: $scope.enfermedades,
        aoColumns: [
            { mData: 'id' },
            { mData: 'enfermedad_nombre' },
            {
                mData: null,
                bSortable: false,
                mRender: function (o) { return '<div class="text-center"><a class="btn btn-xs btn-info" href="#/app/configuracion/enfermedades/editar/'+ o.id + '"><i class="fa fa-pencil"></i></a></div>'; }
            }
        ]
    }
    
    $scope.loading = false;
    
}]);