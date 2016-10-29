app.controller('TerapiasReportesCtrl', ['$scope', '$state', '$filter', 'terapias', 'pacientes', function ($scope, $state, $filter, terapias, pacientes) {
    
    $scope.terapias = [];
    $scope.current = $state.current.name;
    $scope.pacientes = pacientes.data;
    
    console.log($scope.current);
    
    $scope.loading = true;
    $scope.fechaFin = new Date();
    $scope.fechaInicio = new Date();
    $scope.fechaInicio.setDate($scope.fechaFin.getDate() - 30);
    
    if($scope.current == "app.reportes-terapias-pacientes") {
        for(c=0; c<$scope.pacientes.length; c++) {
            for (d=0; d<$scope.pacientes[c].terapias.length; d++) {
                $scope.pacientes[c].terapias[d].paciente_terapia_fecha = new Date($scope.pacientes[c].terapias[d].paciente_terapia_fecha);
                
                $scope.pacientes[c].terapias[d].terapia_fecha_estimada_inicio = new Date($scope.pacientes[c].terapias[d].terapia_fecha_estimada_inicio);

                $scope.pacientes[c].terapias[d].terapia_fecha_estimada_fin = new Date($scope.pacientes[c].terapias[d].terapia_fecha_estimada_fin);
            }
        }
    }
    else if($scope.current == "app.reportes-terapias-completadas") { 
        for(c=0; c<terapias.data.length; c++) {
            if (terapias.data[c].terapia_sesiones_total == terapias.data[c].pacientes_terapias_detalle.length) {
                $scope.terapias.push(terapias.data[c]);
            }
        }
    }
    else if($scope.current == "app.reportes-terapias-pendientes") { 
        for(c=0; c<terapias.data.length; c++) {
            if ( terapias.data[c].pacientes_terapias_detalle.length < terapias.data[c].terapia_sesiones_total) {
                $scope.terapias.push(terapias.data[c]);
            }
        }        
    }    
    else {
        //Get All Facturas
        $scope.terapias = terapias.data;        
    }       
    
    for(c=0; c<$scope.terapias.length; c++) {
        $scope.terapias[c].paciente_terapia_fecha = new Date($scope.terapias[c].paciente_terapia_fecha);
        $scope.terapias[c].terapia_fecha_estimada_inicio = new Date($scope.terapias[c].terapia_fecha_estimada_inicio);
        $scope.terapias[c].terapia_fecha_estimada_fin = new Date($scope.terapias[c].terapia_fecha_estimada_fin);
    }
    
    $scope.terapiasPacientesCantidad = function(obj) {
        cantidad = obj;
        var cantPacientes = 0;
        for(c=0; c<cantidad.length; c++) {
            cantPacientes = cantPacientes + cantidad[c].terapias.length;
        }
        
        return cantPacientes;
    }
    
    console.log($scope.terapias);
    
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