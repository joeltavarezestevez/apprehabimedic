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
    
    
    app.controller('InicioCtrl', ['$scope', '$filter', 'terapiasmensuales', 'pagos', 'facturas', 'consultasmensuales', 'terapiasFac', 'consultasFac', function($scope, $filter, terapiasmensuales, pagos, facturas, consultasmensuales, terapiasFac, consultasFac) {
        
        $scope.hoy = $filter('date')(new Date(),'yyyy-MM-dd');
        $scope.today = $filter('date')(new Date(),'dd-MM-yyyy');
        $scope.fecha = new Date();
        $scope.fechaActual = new Date()-1;
        $scope.labels = [];
        $scope.consultas = [];
        $scope.terapias = [];
        $scope.terapias_all = terapiasmensuales.data;
        $scope.consultas_all = consultasmensuales.data;
        $scope.facturas_all = facturas.data;
        $scope.pagos_all = pagos.data;
        $scope.terapiasporfecha = 0;
        $scope.consultasporfecha = 0;

        $scope.pacientesatendidos = 0;
        $scope.ingresos_recibidos = 0;
        
        var c=0;

        for(c=0; c<$scope.consultas_all.length; c++) {
            $scope.labels.push($scope.consultas_all[c].meses + ' ' + $scope.consultas_all[c].año);
        }

        for(c=0; c<$scope.consultas_all.length; c++) {
            $scope.consultas.push($scope.consultas_all[c].cantidad);
        }

        for(c=0; c<$scope.consultas_all.length; c++) {
            $scope.terapias.push($scope.terapias_all[c].cantidad);
        }

        console.log($scope.consultas_all);
        console.log($scope.labels);
        console.log($scope.consultas);
        console.log($scope.terapias);

        $scope.series = ['Consultas Realizadas', 'Terapias Realizadas'];
        
        $scope.colours =    [
            { // grey
                fillColor: "rgba(79,95,111,0.5)",
                strokeColor: "#4f5f6f",
                pointColor: "#4f5f6f",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#4f5f6f"
            }, 
            { // dark grey
                fillColor: "rgba(89,194,230,0.5)",
                strokeColor: "#59c2e6",
                pointColor: "#59c2e6",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#59c2e6"
            }
        ];

       /* $scope.labels_facturas_pagos = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        
        $scope.series_facturas_pagos = ['Ventas', 'Pagos'];
        
        $scope.colours_facturas_pagos = [{ // grey
                fillColor: "rgba(255,110,64,1)",
                strokeColor: "rgba(255,110,64,1)",
                highlightFill: "rgba(255,110,64,1)",
                highlightStroke: "rgba(255,110,64,1)"
        }, { // dark grey
                fillColor: "rgba(103,58,183,1.0)",
                strokeColor: "rgba(103,58,183,1)",
                highlightFill: "rgba(103,58,183,1)",
                highlightStroke: "rgba(103,58,183,1.0)"
        }];

         $scope.options_facturas_pagos = {
                scaleShowVerticalLines: false,
                scaleShowLabels: true,
                scaleLineWidth: 1,
                scaleLineColor: "rgba(0,0,0,0.1)",
                scaleShowHorizontalLines: false,
                scaleGridLineWidth : 1,
                scaleShowGridLines : false,
                scaleGridLineColor : "rgba(0,0,0,0)",
                pointDotRadius : 5,
                pointHitDetectionRadius : 10,

         };*/
        
        $scope.resumen = function() {

            $scope.fechita = $scope.fecha;
            $scope.fechita = $scope.fechita.setDate($scope.fecha.getDate());
            $scope.fechita = $filter('date')($scope.fechita,'yyyy-MM-dd');
            console.log($scope.fechita);

            consultasFac.consultasporfecha($scope.fechita).success(function(data) {
                $scope.consultasporfecha = parseInt(data[0].consultasRealizadas);
            });

            terapiasFac.terapiasporfecha($scope.fechita).success(function(data) {
                $scope.terapiasporfecha = parseInt(data[0].terapiasRealizadas);
            });

            console.log($scope.consultasporfecha);
            console.log($scope.terapiasporfecha);
            console.log($scope.pacientesatendidos);

           /* $scope.ventas = 0;
            $scope.pagos_recibidos = 0;
            $scope.ingresos_recibidos = 0;
            $scope.terapias = [];
            $scope.consultas = [];
            $scope.facturas = [];
            $scope.pagos = [];*/
            //$scope.terapias = terapias.data;
            //$scope.consultas = consultas.data;
            //$scope.facturas = facturas.data;
            //$scope.pagos = pagos.data;
            
            //Get All Terapias
/*            for(c=0; c<$scope.terapias.length; c++) {
                $scope.terapias[c].terapia_sesion_fecha = new Date($scope.terapias[c].terapia_sesion_fecha);
                $scope.terapias[c].terapia_sesion_fecha.setDate($scope.terapias[c].terapia_sesion_fecha.getDate()+1);
                $scope.terapias[c].terapia_sesion_fecha = $filter('date')($scope.terapias[c].terapia_sesion_fecha,'yyyy-MM-dd');
            }
            //Get All Consultas
            for(c=0; c<$scope.consultas.length; c++) {
                $scope.consultas[c].consulta_fecha = new Date($scope.consultas[c].consulta_fecha);
                $scope.consultas[c].consulta_fecha.setDate($scope.consultas[c].consulta_fecha.getDate()+1);
                $scope.consultas[c].consulta_fecha = $filter('date')($scope.consultas[c].consulta_fecha,'yyyy-MM-dd');
            }
            //Get All Facturas
            for(c=0; c<$scope.facturas.length; c++) {
                $scope.facturas[c].factura_fecha = $filter('date')($scope.facturas[c].factura_fecha,'yyyy-MM-dd');
            }
            //Get All Pagos
            for(c=0; c<$scope.pagos.length; c++) {
                $scope.pagos[c].pago_fecha = $filter('date')($scope.pagos[c].pago_fecha,'yyyy-MM-dd');
            }*/
            
           /* console.log($scope.facturas);
            console.log($scope.pagos);            
            $scope.fechita = $scope.fecha;
            $scope.fechita = $scope.fechita.setDate($scope.fecha.getDate());
            $scope.fechita = $filter('date')($scope.fechita,'yyyy-MM-dd');
            console.log($scope.fechita);
            $scope.terapias = $filter('filter')($scope.terapias, {terapia_sesion_fecha: $scope.fechita});
            $scope.consultas = $filter('filter')($scope.consultas, {consulta_fecha: $scope.fechita});        
            $scope.facturas = $filter('filter')($scope.facturas, {factura_fecha: $scope.fechita});
            $scope.pagos = $filter('filter')($scope.pagos, {pago_fecha: $scope.fechita});
            $scope.facturas_contado = $filter('filter')($scope.facturas, {factura_tipo: "Contado"});*/
            
            //Get All Pacientes Atendidos
            /*$scope.pacientes_atendidos = $scope.terapias.length + $scope.consultas.length;

            //Get All Pagos Recibidos
            for(c=0; c<$scope.pagos.length; c++) {
                $scope.pagos_recibidos = $scope.pagos_recibidos + parseFloat($scope.pagos[c].pago_monto);
                $scope.ingresos_recibidos = $scope.ingresos_recibidos + parseFloat($scope.pagos[c].pago_monto);
            }
            //Get All Ventas
            for(c=0; c<$scope.facturas.length; c++) {
                $scope.ventas = $scope.ventas + parseFloat($scope.facturas[c].factura_total); 
            }
            
            //Get All Ventas al Contado
            for(c=0; c<$scope.facturas_contado.length; c++) {
                $scope.ingresos_recibidos = $scope.ingresos_recibidos + parseFloat($scope.facturas_contado[c].factura_total); 
            }
            
            console.log("Resumen");
            console.log($scope.fechita);
            console.log($scope.terapias);
            console.log($scope.consultas);
            console.log($scope.facturas);
            console.log($scope.pagos);
            console.log($scope.ventas);
            console.log($scope.pagos_recibidos);*/
        }
        
        $scope.resumen();        
        
        /*for(c=0; c<$scope.consultas_all.length; c++) {
            console.log($scope.consultas_all[c]);
            var mes = 0;
            $scope.consultas_all[c].consulta_fecha = new Date($scope.consultas_all[c].consulta_fecha);
            $scope.mes_consulta = $scope.consultas_all[c].consulta_fecha.getUTCMonth();
            $scope.mes_consulta++;
            console.log($scope.mes_consulta);
            
            if($scope.mes_consulta == 1){
                $scope.consultas_enero++;
            }
            else if($scope.mes_consulta == 2){
                $scope.consultas_febrero++;
            }
            else if($scope.mes_consulta == 3){
                $scope.consultas_marzo++;
            }
            else if($scope.mes_consulta == 4){
                $scope.consultas_abril++;
            }
            else if($scope.mes_consulta == 5){
                $scope.consultas_mayo++;
            }
            else if($scope.mes_consulta == 6){
                $scope.consultas_junio++;
            }
            else if($scope.mes_consulta == 7){
                $scope.consultas_julio++;
            }
            else if($scope.mes_consulta == 8){
                $scope.consultas_agosto++;
            }
            else if($scope.mes_consulta == 9){
                $scope.consultas_septiembre++;
            }
            else if($scope.mes_consulta == 10){
                $scope.consultas_octubre++;
            }
            else if($scope.mes_consulta == 11){
                $scope.consultas_noviembre++;
            }
            else if($scope.mes_consulta == 12){
                $scope.consultas_diciembre++;
            }
        }*/
        
        //Get All Terapias Por Mes
        /*for(c=0; c<$scope.terapias_all.length; c++) {
            if($scope.terapias_all[c].estado_id == 4) {   
                $scope.terapias_all[c].terapia_sesion_fecha = new Date($scope.terapias_all[c].terapia_sesion_fecha);
                $scope.mes_terapia = $scope.terapias_all[c].terapia_sesion_fecha.getMonth();
                $scope.mes_terapia++;
                console.log($scope.mes_terapia);

                if($scope.mes_terapia == 1){
                    $scope.terapias_enero++;
                }
                else if($scope.mes_terapia == 2){
                    $scope.terapias_febrero++;
                }
                else if($scope.mes_terapia == 3){
                    $scope.terapias_marzo++;
                }
                else if($scope.mes_terapia == 4){
                    $scope.terapias_abril++;
                }
                else if($scope.mes_terapia == 5){
                    $scope.terapias_mayo++;
                }
                else if($scope.mes_terapia == 6){
                    $scope.terapias_junio++;
                }
                else if($scope.mes_terapia == 7){
                    $scope.terapias_julio++;
                }
                else if($scope.mes_terapia == 8){
                    $scope.terapias_agosto++;
                }
                else if($scope.mes_terapia == 9){
                    $scope.terapias_septiembre++;
                }
                else if($scope.mes_terapia == 10){
                    $scope.terapias_octubre++;
                }
                else if($scope.mes_terapia == 11){
                    $scope.terapias_noviembre++;
                }
                else if($scope.mes_terapia == 12){
                    $scope.terapias_diciembre++;
                }
            }
        }*/
        
        //Get All Ventas por Mes
        /*for(c=0; c<$scope.facturas_all.length; c++) {
            $scope.facturas_all[c].factura_fecha = new Date($scope.facturas_all[c].factura_fecha);
            $scope.mes_factura = $scope.facturas_all[c].factura_fecha.getUTCMonth();
            $scope.mes_factura++;

            if($scope.mes_factura == 1){
                $scope.facturas_enero = $scope.facturas_enero + parseFloat($scope.facturas_all[c].factura_total); 
            }
            else if($scope.mes_factura == 2){
                $scope.facturas_febrero = $scope.facturas_febrero + parseFloat($scope.facturas_all[c].factura_total); 
            }
            else if($scope.mes_factura == 3){
                $scope.facturas_marzo = $scope.facturas_marzo + parseFloat($scope.facturas_all[c].factura_total); 
            }
            else if($scope.mes_factura == 4){
                $scope.facturas_abril = $scope.facturas_abril + parseFloat($scope.facturas_all[c].factura_total); 
            }
            else if($scope.mes_factura == 5){
                $scope.facturas_mayo = $scope.facturas_mayo + parseFloat($scope.facturas_all[c].factura_total); 
            }
            else if($scope.mes_factura == 6){
                $scope.facturas_junio = $scope.facturas_junio + parseFloat($scope.facturas_all[c].factura_total); 
            }
            else if($scope.mes_factura == 7){
                $scope.facturas_julio = $scope.facturas_julio + parseFloat($scope.facturas_all[c].factura_total); 
            }
            else if($scope.mes_factura == 8){
                $scope.facturas_agosto = $scope.facturas_agosto + parseFloat($scope.facturas_all[c].factura_total); 
            }
            else if($scope.mes_factura == 9){
                $scope.facturas_septiembre = $scope.facturas_septiembre + parseFloat($scope.facturas_all[c].factura_total); 
            }
            else if($scope.mes_factura == 10){
                $scope.facturas_octubre = $scope.facturas_octubre + parseFloat($scope.facturas_all[c].factura_total); 
            }
            else if($scope.mes_factura == 11){
                $scope.facturas_noviembre = $scope.facturas_noviembre + parseFloat($scope.facturas_all[c].factura_total); 
            }
            else if($scope.mes_factura == 12){
                $scope.facturas_diciembre = $scope.facturas_diciembre + parseFloat($scope.facturas_all[c].factura_total); 
            }                
        }
        
        //Get All Pagos por Mes
       for(c=0; c<$scope.pagos_all.length; c++) {
            $scope.pagos_all[c].pago_fecha = new Date($scope.pagos_all[c].pago_fecha);
            $scope.mes_pago = $scope.pagos_all[c].pago_fecha.getMonth();
            $scope.mes_pago++;

            if($scope.mes_pago == 1){
                $scope.pagos_enero = $scope.pagos_enero + parseFloat($scope.pagos_all[c].pago_monto);
            }
            else if($scope.mes_pago == 2){
                $scope.pagos_febrero = $scope.pagos_febrero + parseFloat($scope.pagos_all[c].pago_monto);
            }
            else if($scope.mes_pago == 3){
                $scope.pagos_marzo = $scope.pagos_marzo + parseFloat($scope.pagos_all[c].pago_monto);
            }
            else if($scope.mes_pago == 4){
                $scope.pagos_abril = $scope.pagos_abril + parseFloat($scope.pagos_all[c].pago_monto);
            }
            else if($scope.mes_pago == 5){
                $scope.pagos_mayo = $scope.pagos_mayo + parseFloat($scope.pagos_all[c].pago_monto);
            }
            else if($scope.mes_pago == 6){
                $scope.pagos_junio = $scope.pagos_junio + parseFloat($scope.pagos_all[c].pago_monto);
            }
            else if($scope.mes_pago == 7){
                $scope.pagos_julio = $scope.pagos_julio + parseFloat($scope.pagos_all[c].pago_monto);
            }
            else if($scope.mes_pago == 8){
                $scope.pagos_agosto = $scope.pagos_agosto + parseFloat($scope.pagos_all[c].pago_monto);
            }
            else if($scope.mes_pago == 9){
                $scope.pagos_septiembre = $scope.pagos_septiembre + parseFloat($scope.pagos_all[c].pago_monto);
            }
            else if($scope.mes_pago == 10){
                $scope.pagos_octubre = $scope.pagos_octubre + parseFloat($scope.pagos_all[c].pago_monto);
            }
            else if($scope.mes_pago == 11){
                $scope.pagos_noviembre = $scope.pagos_noviembre + parseFloat($scope.pagos_all[c].pago_monto);
            }
            else if($scope.mes_pago == 12){
                $scope.pagos_diciembre = $scope.pagos_diciembre + parseFloat($scope.pagos_all[c].pago_monto);
            }
        }  */

        $scope.data = [$scope.consultas, $scope.terapias];
        /*$scope.data = [
            [
                $scope.consultas_enero,
                $scope.consultas_febrero,
                $scope.consultas_marzo,
                $scope.consultas_abril,
                $scope.consultas_mayo,
                $scope.consultas_junio,
                $scope.consultas_julio,
                $scope.consultas_agosto,
                $scope.consultas_septiembre,
                $scope.consultas_octubre,
                $scope.consultas_noviembre,
                $scope.consultas_diciembre
            ],
            [
                $scope.terapias_enero,
                $scope.terapias_febrero,
                $scope.terapias_marzo,
                $scope.terapias_abril,
                $scope.terapias_mayo,
                $scope.terapias_junio,
                $scope.terapias_julio,
                $scope.terapias_agosto,
                $scope.terapias_septiembre,
                $scope.terapias_octubre,
                $scope.terapias_noviembre,
                $scope.terapias_diciembre
            ]
         ]
        
        $scope.data_facturas_pagos = [ 
              [
                $scope.facturas_enero,
                $scope.facturas_febrero,
                $scope.facturas_marzo,
                $scope.facturas_abril,
                $scope.facturas_mayo,
                $scope.facturas_junio,
                $scope.facturas_julio,
                $scope.facturas_agosto,
                $scope.facturas_septiembre,
                $scope.facturas_octubre,
                $scope.facturas_noviembre,
                $scope.facturas_diciembre
              ],
              [
                $scope.pagos_enero,
                $scope.pagos_febrero,
                $scope.pagos_marzo,
                $scope.pagos_abril,
                $scope.pagos_mayo,
                $scope.pagos_junio,
                $scope.pagos_julio,
                $scope.pagos_agosto,
                $scope.pagos_septiembre,
                $scope.pagos_octubre,
                $scope.pagos_noviembre,
                $scope.pagos_diciembre                      
              ]
        ]       

        console.log($scope.data_facturas_pagos);*/
        console.log($scope.data);
        
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
        
        $scope.today = function() {
            $scope.dt = new Date();
          };
        
        $scope.today();
        
        $scope.clear = function () {
            $scope.dt = null;
        };

          // Disable weekend selection
          $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0) );
          };

          $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
          };

          $scope.toggleMin();

        $scope.dtpick = {
                opened: false,
                opened2: false
              }

          $scope.open = function($event,type) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.dtpick[type] = true;
          };

          $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
          };

          $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
          $scope.format = $scope.formats[0];

          var tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          var afterTomorrow = new Date();
          afterTomorrow.setDate(tomorrow.getDate() + 2);
          $scope.events =
            [
              {
                date: tomorrow,
                status: 'full'
              },
              {
                date: afterTomorrow,
                status: 'partially'
              }
            ];

          $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
              var dayToCheck = new Date(date).setHours(0,0,0,0);

              for (var i=0;i<$scope.events.length;i++){
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                  return $scope.events[i].status;
                }
              }
            }

            return '';
          };        
    }])
    app.controller('MenuCtrl', function($scope) {
        $scope.isCollapsed = true;
        $scope.charts = ['Line', 'Bar', 'Doughnut', 'Pie', 'Polar Area', 'Radar', 'Base'];
    });    
    
    app.controller('HospitalSurveyCtrl', ['$scope', '$timeout', function($scope, $timeout) {
        $scope.labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio','Agosto','Septiembre','Octubre', 'Noviembre', 'Diciembre'];
        $scope.series = ['Terapias Realizadas', 'Consultas Realizadas'];
        
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
