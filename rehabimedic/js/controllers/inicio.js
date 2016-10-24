(function() {
    'use strict';

    /*  var app = angular.module('examples', ['chart.js', 'ui.bootstrap']);*/

    app.config(function(ChartJsProvider) {
        // Configure all charts
        ChartJsProvider.setOptions({
            colours: ['#FF6E40', '#FBC02E', '#673AB7', '#66bd78', '#f05050'],
            responsive: true
        });
        // Configure all doughnut charts
        ChartJsProvider.setOptions('Doughnut', {
            animateScale: true
        });
    });
    
    
    app.controller('InicioCtrl', ['$scope', '$filter', 'terapias', 'pagos', 'facturas', 'consultas', function($scope, $filter, terapias, pagos, facturas, consultas) {
        
        $scope.hoy = $filter('date')(new Date(),'yyyy-MM-dd');
        
        $scope.terapias = terapias.data;
        console.log($scope.terapias);
        $scope.consultas = consultas.data;
        $scope.facturas = facturas.data;
        $scope.pagos = pagos.data;
        $scope.pacientes_atendidos = 0;
        console.log($scope.pacientes_atendidos);
        
        console.log($scope.pagos);
        var c=0;
        $scope.ventas = 0;
        $scope.pagos_recibidos = 0;
        
        //Set terapias Fechas to Date Type
        /*for(c=0; c<$scope.terapias.length; c++) {
            $scope.terapias[c].paciente_terapia_fecha = $filter('date')(new Date($scope.terapias[c].paciente_terapia_fecha),'yyyy-MM-dd');
        }        
        //Set Consultas Fechas to Date Type
        for(c=0; c<$scope.consultas.length; c++) {
            $scope.consultas[c].consulta_fecha = new Date($scope.consultas[c].consulta_fecha);
        }       
        //Set Facturas Fechas to Date Type
        for(c=0; c<$scope.facturas.length; c++) {
            $scope.facturas[c].factura_fecha = $filter('date')(new Date($scope.facturas[c].factura_fecha),'yyyy-MM-dd');
        }
        //Set Pagos Fechas to Date Type
        for(c=0; c<$scope.facturas.length; c++) {
            $scope.pagos[c].pago_fecha = $filter('date')(new Date($scope.pagos[c].pago_fecha),'yyyy-MM-dd');
        }*/
        $scope.terapias = $filter('filter')($scope.terapias, {paciente_terapia_fecha: $scope.hoy});
        $scope.consultas = $filter('filter')($scope.consultas, {consulta_fecha: $scope.hoy});        
        $scope.facturas = $filter('filter')($scope.facturas, {factura_fecha: $scope.hoy});
        $scope.pagos = $filter('filter')($scope.pagos, {pago_fecha: $scope.hoy});        
        console.log($scope.consultas);
        console.log($scope.terapias);
        
        //Get All Pacientes Atendidos
        $scope.pacientes_atendidos = $scope.terapias.length + $scope.consultas.length;
        
        //Get All Pagos Recibidos
        for(c=0; c<$scope.pagos.length; c++) {
            $scope.pagos_recibidos = $scope.pagos_recibidos + parseFloat($scope.pagos[c].pago_monto); 
        }
        //Get All Ventas
        for(c=0; c<$scope.facturas.length; c++) {
            $scope.ventas = $scope.ventas + parseFloat($scope.facturas[c].factura_total); 
        }
        console.log($scope.pagos_recibidos);
        console.log($scope.ventas);
        console.log("Ventas");
    }])
    app.controller('MenuCtrl', function($scope) {
        $scope.isCollapsed = true;
        $scope.charts = ['Line', 'Bar', 'Doughnut', 'Pie', 'Polar Area', 'Radar', 'Base'];
    });



    app.controller('HospitalSurveyCtrl', ['$scope', '$timeout', function($scope, $timeout) {
        $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October'];
        $scope.series = ['Quality of Service', 'Would Recommend Our Service'];
        $scope.data = [
            [65, 59, 80, 81, 56,80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90,86, 27, 90]
        ];
        $scope.onClick = function(points, evt) {
            console.log(points, evt);
        };
        $scope.onHover = function(points) {
            if (points.length > 0) {
                console.log('Point', points[0].value);
            } else {
                console.log('No point');
            }
        };
        $scope.colours = [{ // grey
                fillColor: "rgba(79,95,111,0.5)",
                strokeColor: "#4f5f6f",
                pointColor: "#4f5f6f",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#4f5f6f"
        }, { // dark grey
                fillColor: "rgba(89,194,230,0.5)",
                strokeColor: "#59c2e6",
                pointColor: "#59c2e6",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#59c2e6"
        }];

    }]);



    app.controller('HospitalBudgetCtrl', ['$scope', '$timeout', function($scope, $timeout) {
        $scope.labels = ['2010', '2011', '2012', '2013', '2014', '2015'];
        $scope.series = ['Public Health Budget', 'Staffing', 'Inpatient discharges', 'ED Admissions', 'Outpatient Attendance', 'Day Cases'];
        $scope.data = [
            [6500, 5900, 8000, 8100, 5600, 5500],
            [4800, 7800, 5000, 7900, 5600, 7700],
            [5500, 6900, 3000, 5100, 5600, 4500],
            [2800, 4800, 4000, 1900, 8200, 5700],
            [4500, 5900, 4000, 8100, 5600, 7500],
            [5800, 6400, 8000, 3900, 7600, 6700]
        ];
        $scope.onClick = function(points, evt) {
            console.log(points, evt);
        };
        $scope.onHover = function(points) {
            if (points.length > 0) {
                console.log('Point', points[0].value);
            } else {
                console.log('No point');
            }
        };
        $scope.colours = [{ // grey
                fillColor: "rgba(79,95,111,0)",
                strokeColor: "#4f5f6f",
                pointColor: "#4f5f6f",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#4f5f6f"
        }, { // dark grey
                fillColor: "rgba(89,194,230,0)",
                strokeColor: "#59c2e6",
                pointColor: "#59c2e6",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#59c2e6"
        }, { // dark grey
                fillColor: "rgba(253,180,93,0)",
                strokeColor: "#fdd835",
                pointColor: "#fdd835",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#fdd835"
        }, { // dark grey
                fillColor: "rgba(76,175,80,0)",
                strokeColor: "#4caf50",
                pointColor: "#4caf50",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#4caf50"
        }, { // dark grey
                fillColor: "rgba(244,67,54,0)",
                strokeColor: "#f44336",
                pointColor: "#f44336",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#f44336"
        }, { // dark grey
                fillColor: "rgba(158,158,158,0)",
                strokeColor: "#9e9e9e",
                pointColor: "#9e9e9e",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#9e9e9e"
        }];

    }]);


    function getRandomValue(data) {
        var l = data.length,
            previous = l ? data[l - 1] : 50;
        var y = previous + Math.random() * 10 - 5;
        return y < 0 ? 0 : y > 100 ? 100 : y;
    }

})();
