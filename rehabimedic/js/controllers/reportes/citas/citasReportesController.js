app.controller('CitasReportesCtrl', ['$scope', '$state', '$filter', 'citas', 'pacientes', function ($scope, $state, $filter, citas, pacientes) {
    
    $scope.citas = [];
    $scope.current = $state.current.name;
    $scope.pacientes = pacientes.data;
    
    console.log($scope.current);   
    
    $scope.loading = true;
    $scope.fechaFin = new Date();
    $scope.fechaInicio = new Date();
    $scope.fechaInicio.setDate($scope.fechaFin.getDate() - 30);
    
    if($scope.current == "app.reportes-citas-canceladas") {
        for(c=0; c<citas.data.length; c++) {
            //Get Citas Canceladas
            if (citas.data[c].estado_id == 3) {
                $scope.citas.push(citas.data[c]);
            }
        }
    }
    else if($scope.current == "app.reportes-citas-pendientes") {
        for(c=0; c<citas.data.length; c++) {
            //Get Citas Pendientes
            if (citas.data[c].estado_id == 1) {
                $scope.citas.push(citas.data[c]);
            }
        }
    }
    else if($scope.current == "app.reportes-citas-realizadas") {
        for(c=0; c<citas.data.length; c++) {
            //Get Citas Realizadas
            if (citas.data[c].estado_id == 4) {
                $scope.citas.push(citas.data[c]);
            }
        }
    }
    else if($scope.current == "app.reportes-citas-pacientes") {
        for(c=0; c<$scope.pacientes.length; c++) {
            for (d=0; d<$scope.pacientes[c].citas.length; d++) {
                $scope.pacientes[c].citas[d].cita_fecha_hora = new Date($scope.pacientes[c].citas[d].cita_fecha_hora);
            }
        }
    }    
    else {
        //Get All citas
        $scope.citas = citas.data;
    }       
    
    for(c=0; c<$scope.citas.length; c++) {
        $scope.citas[c].cita_fecha_hora = new Date($scope.citas[c].cita_fecha_hora);
    }
    
    
    $scope.citasPacientesCantidad = function(obj) {
        cantidad = obj;
        var cantPacientes = 0;
        for(c=0; c<cantidad.length; c++) {
            cantPacientes = cantPacientes + cantidad[c].citas.length;
        }
        
        return cantPacientes;
    }
    
    console.log($scope.citas);
    
    $scope.loading = false;
    
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