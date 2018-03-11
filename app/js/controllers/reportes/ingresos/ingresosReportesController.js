app.controller('IngresosReportesCtrl', ['$scope', '$state', '$filter', 'facturas', 'pagos', function ($scope, $state, $filter, facturas, pagos) {
    $scope.documentos = [];
    $scope.facturas = [];
    $scope.pagos = [];
    $scope.facturas_contado = [];
    $scope.facturas_credito = [];
    $scope.documento = {};
    $scope.current = $state.current.name;
    $scope.loading = true;
    $scope.fecha = new Date();
    $scope.today  = new Date();
    
    //Get All Facturas y Pagos
    $scope.facturas = facturas.data;
    $scope.pagos = pagos.data;
    
    $scope.resumen = function() {
        $scope.ventas = 0;
        $scope.ventas_contado = 0;
        $scope.ventas_credito = 0;
        $scope.pagos_recibidos = 0;
        $scope.ingresos_recibidos = 0;
        $scope.ingresos_recibidos_efectivo = 0;
        $scope.ingresos_recibidos_cheque = 0;
        $scope.ingresos_recibidos_tarjeta = 0;
        $scope.documentos = [];
        $scope.facturas = [];
        $scope.pagos = [];
        $scope.facturas_contado = [];
        $scope.facturas_credito = [];
        $scope.documentos_cheque = [];
        $scope.documentos_efectivo = [];
        $scope.documentos_tarjeta = [];
        $scope.documento = {};
        
        $scope.facturas = facturas.data;
        $scope.pagos = pagos.data;

        //Get All Facturas
        for(c=0; c<$scope.facturas.length; c++) {
            $scope.facturas[c].factura_fecha = $filter('date')($scope.facturas[c].factura_fecha,'yyyy-MM-dd');
        }
        //Get All Pagos
        for(c=0; c<$scope.pagos.length; c++) {
            $scope.pagos[c].pago_fecha = $filter('date')($scope.pagos[c].pago_fecha,'yyyy-MM-dd');
        }

        $scope.fechita = $scope.fecha;
        $scope.fechita = $scope.fechita.setDate($scope.fecha.getDate());
        $scope.fechita = $filter('date')($scope.fechita,'yyyy-MM-dd');

        $scope.facturas = $filter('filter')($scope.facturas, {factura_fecha: $scope.fechita});
        $scope.pagos = $filter('filter')($scope.pagos, {pago_fecha: $scope.fechita});
        $scope.facturas_contado = $filter('filter')($scope.facturas, {factura_tipo: "Contado"});
        $scope.facturas_credito = $filter('filter')($scope.facturas, {factura_tipo: "Credito"});
        
        //Get All Ventas
        for(c=0; c<$scope.facturas.length; c++) {
            $scope.ventas = $scope.ventas + parseFloat($scope.facturas[c].factura_total);
        }
        
        //Get All Ventas al Contado
        for(c=0; c<$scope.facturas_contado.length; c++) {
            $scope.ventas_contado = $scope.ventas_contado + parseFloat($scope.facturas_contado[c].factura_total);
            $scope.documento = {};
            $scope.documento.documento_numero = $scope.facturas_contado[c].factura_numero;
            $scope.documento.paciente = $scope.facturas_contado[c].paciente.persona.persona_nombres + " " + $scope.facturas_contado[c].paciente.persona.persona_apellidos;
            $scope.documento.documento_fecha = new Date($scope.facturas_contado[c].factura_fecha);
            $scope.documento.documento_tipo = "Fac. al Contado";
            $scope.documento.documento_monto = $scope.facturas_contado[c].factura_total;
            $scope.documento.documento_estado = $scope.facturas_contado[c].estado.estado_nombre;
            $scope.documento.documento_metodo_pago = $scope.facturas_contado[c].factura_metodo_pago;
            $scope.documentos.push($scope.documento);
        }
        
        //Get All Ventas a Credito
        for(c=0; c<$scope.facturas_credito.length; c++) {
            $scope.ventas_credito = $scope.ventas_credito + parseFloat($scope.facturas_credito[c].factura_total);
            $scope.documento = {};
            $scope.documento.documento_numero = $scope.facturas_credito[c].factura_numero;
            $scope.documento.paciente = $scope.facturas_credito[c].paciente.persona.persona_nombres + " " + $scope.facturas_credito[c].paciente.persona.persona_apellidos;
            $scope.documento.documento_fecha = new Date($scope.facturas_credito[c].factura_fecha);
            $scope.documento.documento_tipo = "Fac. a Credito";
            $scope.documento.documento_monto = $scope.facturas_credito[c].factura_total;
            $scope.documento.documento_estado = $scope.facturas_credito[c].estado.estado_nombre;
            $scope.documento.documento_metodo_pago = $scope.facturas_credito[c].factura_metodo_pago;
            $scope.documentos.push($scope.documento);
        }
        
        //Get All Pagos Recibidos
        for(c=0; c<$scope.pagos.length; c++) {
            $scope.pagos_recibidos = $scope.pagos_recibidos + parseFloat($scope.pagos[c].pago_monto);
            $scope.documento = {};
            $scope.documento.documento_numero = $filter('minLength')($scope.pagos[c].id, 8);
            $scope.documento.paciente = $scope.pagos[c].paciente.persona.persona_nombres + " " + $scope.pagos[c].paciente.persona.persona_apellidos;
            $scope.documento.documento_fecha = new Date($scope.pagos[c].pago_fecha);
            $scope.documento.documento_tipo = "Pago";
            $scope.documento.documento_monto = $scope.pagos[c].pago_monto;
            $scope.documento.documento_estado = $scope.pagos[c].estado.estado_nombre;
            $scope.documento.documento_metodo_pago = $scope.pagos[c].pago_metodo_pago;
            $scope.documentos.push($scope.documento);
        }        
        
        //Get All Ingresos Recibidos
        $scope.ingresos_recibidos = $scope.pagos_recibidos + $scope.ventas_contado;
        
        //Get All Documentos Efectivo
        $scope.documentos_efectivo = $filter('filter')($scope.documentos, {documento_metodo_pago: "1"});
        
        //Get All Documentos Cheque
        $scope.documentos_cheque = $filter('filter')($scope.documentos, {documento_metodo_pago: "2"});
        
        //Get All Documentos Tarjeta de Credito
        $scope.documentos_tarjeta = $filter('filter')($scope.documentos, {documento_metodo_pago: "3"});
        
        //Get Ingresos en Efectivo
        for(c=0; c<$scope.documentos_efectivo.length; c++) {
            $scope.ingresos_recibidos_efectivo = $scope.ingresos_recibidos_efectivo + parseFloat($scope.documentos_efectivo[c].documento_monto);
        }
        //Get Ingresos en Cheque
        for(c=0; c<$scope.documentos_cheque.length; c++) {
            $scope.ingresos_recibidos_cheque = $scope.ingresos_recibidos_cheque + parseFloat($scope.documentos_cheque[c].documento_monto);
        }
        //Get Ingresos en Tarjeta de Credito
        for(c=0; c<$scope.documentos_tarjeta.length; c++) {
            $scope.ingresos_recibidos_tarjeta = $scope.ingresos_recibidos_tarjeta + parseFloat($scope.documentos_tarjeta[c].documento_monto);
        }        
        
        /*console.log("Resumen del " + $scope.fechita);
        console.log("Facturas:");
        console.log($scope.facturas);
        console.log("Facturas al Contado:");
        console.log($scope.facturas_contado);
        console.log("Facturas a Credito:");
        console.log($scope.facturas_credito);
        console.log("Pagos:");
        console.log($scope.pagos);
        console.log("Total de Ventas: " + $scope.ventas);
        console.log("Total de Ventas A Credito: " + $scope.ventas_credito);
        console.log("Total de Ventas Al Contado: " + $scope.ventas_contado);
        console.log("Total de Pagos Recibidos: " + $scope.pagos_recibidos);
        console.log("Total de Ingresos del dia: " + $scope.ingresos_recibidos);
        console.log("Detalle: ");
        console.log($scope.documentos);*/
    }
        
    $scope.resumen();
    
    $scope.exportarExcel = function (divName) {
        var blob = new Blob([document.getElementById(divName).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var date = new Date();
        date = $filter('date')(date,'yyyyMMddmmss');
        var fileName = "Reporte_Ingresos_" + date +".xls";
        saveAs(blob, fileName);
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