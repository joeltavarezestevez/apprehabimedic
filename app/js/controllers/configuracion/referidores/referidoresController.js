app.controller('ReferidoresCtrl', ['$scope', '$stateParams', '$timeout', '$state', 'Notification', 'referidores', function ($scope, $stateParams, $timeout, $state, Notification, referidores) {
    
    $scope.loading = true;
    
    //Get All referidores
    $scope.referidores = referidores.data;
    console.log($scope.referidores);
    $scope.tbOptions = {
        data: $scope.referidores,
        aoColumns: [
            { mData: 'id' },
            { mData: 'referidor_nombre' },
			{ mData: 'referidor_telefono' },
            {
                mData: null,
                bSortable: false,
                mRender: function (o) { return '<div class="text-center"><a class="btn btn-xs btn-info" href="#/app/configuracion/referidores/editar/'+ o.id + '"><i class="fa fa-pencil"></i></a></div>'; }
            }
        ]
    }
    
    $scope.loading = false;
    
}]);