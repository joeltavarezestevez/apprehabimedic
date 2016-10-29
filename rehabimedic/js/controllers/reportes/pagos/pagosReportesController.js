app.controller('PagosReportesCtrl', ['$scope', '$state', '$filter', 'pagos', 'pacientes', function ($scope, $state, $filter, pagos, pacientes) {
    $scope.pagos = [];
    $scope.current = $state.current.name;
    $scope.pacientes = pacientes.data;
    
    console.log($scope.current);
    
    $scope.loading = true;
    $scope.fechaFin = new Date();
    $scope.fechaInicio = new Date();
    $scope.fechaInicio.setDate($scope.fechaFin.getDate() - 30);
    
    if($scope.current == "app.reportes-pagos-anulados") {
        for(c=0; c<pagos.data.length; c++) {
            //Get Facturas Anuladas
            if (pagos.data[c].estado_id == 5) {
                $scope.pagos.push(pagos.data[c]);
            }
        }
    }
    else if($scope.current == "app.reportes-pagos-pacientes") {
        for(c=0; c<$scope.pacientes.length; c++) {
            for (d=0; d<$scope.pacientes[c].pagos.length; d++) {
                $scope.pacientes[c].pagos[d].pago_fecha = new Date($scope.pacientes[c].pagos[d].pago_fecha);
            }
        }
    }
    else {
        //Get All Pagos
        $scope.pagos = pagos.data;        
    }
    
    for(c=0; c<$scope.pagos.length; c++) {
        $scope.pagos[c].pago_fecha = new Date($scope.pagos[c].pago_fecha);
    }
    
    $scope.pagosTotal = function(obj) {
        var total = 0;
        
        for(c =0; c< obj.length; c++) {
         total = total + parseFloat(obj[c].pago_monto);
        }
        
        return total;
    }
    
    $scope.pagosPacientesTotal = function(obj) { 
        var totalPacientes = 0;
        for(c=0; c<obj.length; c++) {
            for (d=0; d<obj[c].pagos.length; d++) {
                totalPacientes = totalPacientes + parseFloat(obj[c].pagos[d].pago_monto);
            }
        }
        
        return totalPacientes;
    }
    
    $scope.pagosPacientesCantidad = function(obj) { 
        var cantPacientes = 0;
        for(c=0; c<obj.length; c++) {
            cantPacientes = cantPacientes + obj[c].pagos.length;
        }
        
        return cantPacientes;
    }
    
    console.log($scope.pagos);
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