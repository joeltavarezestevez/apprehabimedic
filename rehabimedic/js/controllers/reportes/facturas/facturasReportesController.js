app.controller('FacturasReportesCtrl', ['$scope', '$state', '$filter', 'facturas', 'pacientes', function ($scope, $state, $filter, facturas, pacientes) {
    $scope.facturas = [];
    $scope.current = $state.current.name;
    $scope.pacientes = pacientes.data;
    
    console.log($scope.current);
    
    $scope.comprobantes = [
      {id:3, nombre:'Credito Fiscal'},
      {id:4, nombre:'Consumidor Final'}
    ];
    
    $scope.facturas_tipo = [
      {id:"Contado", nombre:'Contado'},
      {id:"Credito", nombre:'Credito'}
    ];    
    
    $scope.loading = true;
    $scope.fechaFin = new Date();
    $scope.fechaInicio = new Date();
    $scope.fechaInicio.setDate($scope.fechaFin.getDate() - 30);
    
    if($scope.current == "app.reportes-facturas-anuladas") {
        for(c=0; c<facturas.data.length; c++) {
            //Get Facturas Anuladas
            if (facturas.data[c].estado_id == 5) {
                $scope.facturas.push(facturas.data[c]);
            }
        }
    }
    else if($scope.current == "app.reportes-facturas-balance") {
        for(c=0; c<facturas.data.length; c++) {
            //Get Facturas con Balance
            if (facturas.data[c].factura_balance > 0.00) {
                $scope.facturas.push(facturas.data[c]);
            }
        }
    }
    else if($scope.current == "app.reportes-facturas-saldadas") {
        for(c=0; c<facturas.data.length; c++) {
            //Get Facturas Saldadas
            if (facturas.data[c].factura_balance == 0.00) {
                $scope.facturas.push(facturas.data[c]);
            }
        }
    }
    else if($scope.current == "app.reportes-facturas-pacientes") {
        for(c=0; c<$scope.pacientes.length; c++) {
            for (d=0; d<$scope.pacientes[c].facturas.length; d++) {
                $scope.pacientes[c].facturas[d].factura_fecha = new Date($scope.pacientes[c].facturas[d].factura_fecha);
            }
        }
    }    
    else {
        //Get All Facturas
        $scope.facturas = facturas.data;        
    }
    
    for(c=0; c<$scope.facturas.length; c++) {
        $scope.facturas[c].factura_fecha = new Date($scope.facturas[c].factura_fecha);
    }
    
    $scope.facturasTotal = function(obj) {
        var total = 0;
        
        for(c =0; c< obj.length; c++) {
         total = total + parseFloat(obj[c].factura_total);
        }
        
        return total;
    }
    
        $scope.facturasBalance = function(obj) {
        var balance = 0;
        
        for(c =0; c< obj.length; c++) {
         balance = balance + parseFloat(obj[c].factura_balance);
        }
        
        return balance;
    }
    
    $scope.facturasPacientesTotal = function(obj) { 
        var totalPacientes = 0;
        for(c=0; c<obj.length; c++) {
            for (d=0; d<obj[c].facturas.length; d++) {
                totalPacientes = totalPacientes + parseFloat(obj[c].facturas[d].factura_total);
            }
        }
        
        return totalPacientes;
    }
    
        $scope.facturasPacientesBalance = function(obj) { 
        var balancePacientes = 0;
        for(c=0; c<obj.length; c++) {
            for (d=0; d<obj[c].facturas.length; d++) {
                balancePacientes = balancePacientes + parseFloat(obj[c].facturas[d].factura_balance);
            }
        }
        
        return balancePacientes;
    }
    
    $scope.facturasPacientesCantidad = function(obj) {
        console.log(obj);
        cantidad = obj;
        var cantPacientes = 0;
        for(c=0; c<cantidad.length; c++) {
            //cantidad[c].facturas = $filter('dateRangeFacturas')(cantidad[c].facturas, $scope.fechaInicio, $scope.fechaFin);
            cantPacientes = cantPacientes + cantidad[c].facturas.length;
        }
        
        return cantPacientes;
    }    
    
    
    console.log($scope.facturas);
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