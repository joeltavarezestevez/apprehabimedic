//creamos el controlador pasando $scope y $http, así los tendremos disponibles
app.controller('loginController', function($scope, $location, Auth) 
{
    //la función login que llamamos en la vista llama a la función
    //login de la factoria auth pasando lo que contiene el campo
    //de texto del formulario
  /*  $scope.login = function()
    {
        auth.login($scope.username, $scope.password);
    }*/
    $scope.user={};
    $scope.authError = null;
    $scope.login = function () {
        Auth.login($scope.user)
        .then(
            function(response){
                console.log(response.data);
                if (response.data == "Usuario no encontrado."){
                    $scope.authError = "Este usuario no existe";
                }
                else if (response.data == "Contraseña no coincide.") {
                    $scope.authError = "Contraseña incorrecta";
                }
                else if(response.data == "Este usuario esta inactivo. Comuniquese con el Administrador.") {
                    $scope.authError = response.data;
                }
                else {
                    $scope.usuario = response.data;
                    $scope.tipo = $scope.usuario.perfil_usuario_id;
                    //$scope.tipo = 4;
                    Auth.setLoggedInUser(response.data);
                    if($scope.tipo == 1){
                        $location.path("/");   
                    }
                    else if ($scope.tipo == 2) {
                        $location.path("/app/facturas");
                    }
                    else if ($scope.tipo == 3) {
                        $location.path("/app/consultas");
                    }
                    else if ($scope.tipo == 4) {
                        $location.path("/app/terapias");
                    }
                }
            },
            function(response){
                $scope.authError = response;
            }
        )
    }
});