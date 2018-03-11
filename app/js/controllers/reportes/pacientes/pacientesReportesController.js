app.controller('PacientesReportesCtrl', ['$scope', '$filter', 'pacientes', function ($scope, $filter, pacientes) {
    
    $scope.loading = true;
   
    //Get All Pacientes
    $scope.pacientes = pacientes.data;
    console.log($scope.pacientes);
    
    $scope.loading = false;
    
    $scope.pacientesTotal = function(obj) {
        var total = 0;
        
        for(c =0; c< obj.length; c++) {
         total = total + parseFloat(obj[c].paciente_balance);
        }
        
        return total;
    }    
    
    var c = 0;
    
    for(c=0; c< $scope.pacientes.length; c++) {
        
        d = new Date($scope.pacientes[c].persona.persona_fecha_nacimiento);
        d.setDate(d.getDate() + 1);
        $scope.pacientes[c].persona.persona_fecha_nacimiento = d;
        $scope.pacientes[c].persona_imagen_perfil = $scope.pacientes[c].persona.persona_imagen_perfil;
        $scope.fecha_nacimiento = $filter('date')($scope.pacientes[c].persona.persona_fecha_nacimiento,'dd-MM-yyyy');

        $scope.pacientes[c].enfermedad_id = [];
        angular.forEach($scope.pacientes[c].pacientes_enfermedades, function(value, key) {
            $scope.pacientes[c].enfermedad_id.push(value.enfermedad_id.toString());
        });

        $scope.pacientes[c].cirugias = [];
        angular.forEach($scope.pacientes[c].pacientes_cirugias, function(value, key) {
            $scope.pacientes[c].cirugias.push(value.cirugia_descripcion.toString());
        });

        if($scope.pacientes[c].pacientes_fracturas.length > 0){
            $scope.pacientes[c].fractura = 1;
            $scope.pacientes[c].fracturas = [];
            angular.forEach($scope.pacientes[c].pacientes_fracturas, function(value, key) {
                $scope.pacientes[c].fracturas.push(value.cuerpo_parte_id.toString());
            });                    
        }
        else {
            $scope.pacientes[c].fractura = 2;
        }

        angular.forEach($scope.pacientes[c].persona.personas_telefonos, function(value, key) {
            if (value.tipo_telefono_id == 1) {
                $scope.pacientes[c].persona_telefono = value.telefono_numero;
            }
            else {
                $scope.pacientes[c].persona_celular = value.telefono_numero;
            }
        });

        if($scope.pacientes[c].aseguradora_id != 1) {
            $scope.pacientes[c].seguro = 1;
        }
        else {
            $scope.pacientes[c].seguro = 0;
        }

        if($scope.pacientes[c].paciente_referencia == null) {
            $scope.pacientes[c].referencia_tipo = "ninguno";
        }
        else {
            $scope.pacientes[c].referencia_tipo = $scope.pacientes[c].paciente_referencia.referencia_tipo;
            $scope.pacientes[c].persona_referencia = $scope.pacientes[c].paciente_referencia.persona_referencia;
        }

        if($scope.pacientes[c].pacientes_fracturas.length == 0){
            $scope.pacientes[c].fractura = 2;
        }
    }
    
    
    $scope.printDiv = function (divName) {

        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;      

        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            var popupWin = window.open('', '_blank', 'width=800,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWin.window.focus();
            popupWin.document.write('<!DOCTYPE html><html><head>' +
                '<link rel="stylesheet" type="text/css" href="../bower_components/bootstrap/dist/css/bootstrap.min.css" /> <link href="../bower_components/bootstrap/dist/css/bootstrap-theme.min.css" rel="stylesheet" type="text/css" /> <link href="../bower_components/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" /> <link href="css/material-icons.css" rel="stylesheet" type="text/css" /> <link href="../bower_components/animate.css/animate.min.css" rel="stylesheet" type="text/css" /><script src="../bower_components/angular/angular.js"></script>' +
                '</head><body onload="window.print()"><div class="container-fluid" style="margin-left: 0px; margin-right: 0px;">' + printContents + '</div></html>');
            popupWin.onbeforeunload = function (event) {
                popupWin.close();
                return '.\n';
            };
            popupWin.onabort = function (event) {
                popupWin.document.close();
                popupWin.close();
            }
        } else {
            var popupWin = window.open('', '_blank', 'width=800,height=600');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="../bower_components/bootstrap/dist/css/bootstrap.min.css" /> <link href="../bower_components/bootstrap/dist/css/bootstrap-theme.min.css" rel="stylesheet" type="text/css" /> <link href="../bower_components/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" /> <link href="css/material-icons.css" rel="stylesheet" type="text/css" /> <link href="../bower_components/animate.css/animate.min.css" rel="stylesheet" type="text/css" /></head><body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
        }
        popupWin.document.close();

        return true;
    }    
}]);