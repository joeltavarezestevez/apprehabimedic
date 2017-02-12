'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .config(
        ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG',
            function($stateProvider, $urlRouterProvider, JQ_CONFIG) {

                $urlRouterProvider
                    .otherwise('/app/inicio');
                $stateProvider

                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: 'partials/app.html',
                        controller: 'ModalDemoCtrl',
                        resolve: {
                            menu: function(menuFac) {
                                return menuFac.all();
                            }                            
                        }                    
                    })
                    /***********************************************************************
                    *                            Inicio State                              *
                    ***********************************************************************/
                    .state('app.inicio', {
                        url: '/inicio',
                        templateUrl: 'templates/inicio.html',
                        controller: 'InicioCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load('chart.js').then(
                                        function() {
                                            return $ocLazyLoad.load('js/controllers/inicio.js');
                                        }
                                    )
                                    .then(
                                        function() {
                                            return $ocLazyLoad.load('../bower_components/font-awesome/css/font-awesome.css');
                                        }
                                    );
                                }
                            ],
                            terapias: function(terapiasDetallesFac) {
                                return terapiasDetallesFac.all();
                            },
                            facturas: function(facturasFac) {
                                return facturasFac.all();
                            },
                            consultas: function(consultasFac) {
                                return consultasFac.all();
                            },
                            pagos: function(pagosFac) {
                                return pagosFac.all();
                            }                            
                        }
                    })
                    /***********************************************************************
                    *                            Login State                              *
                    ***********************************************************************/
                    .state('login', {
                        url: '/login',
                        templateUrl: 'templates/login.html',
                        controller: 'loginController'
                    })                    
                    /***********************************************************************
                    *                            Aseguradoras States                       *
                    ***********************************************************************/
                    .state('app.aseguradoras', {
                        url: '/aseguradoras',
                        templateUrl: 'templates/aseguradoras/aseguradoras.html',
                        controller: 'AseguradorasCtrl'
                    })            
                    .state('app.aseguradora-nuevo', {
                        url: '/aseguradoras/nuevo',
                        templateUrl: 'templates/aseguradoras/aseguradora-nuevo.html',
                        controller: 'AseguradorasDetalleCtrl'
                    })    
                    .state('app.aseguradora-edit', {
                        url: '/aseguradoras/editar/:id',
                        templateUrl: 'templates/aseguradoras/aseguradora-editar.html',
                        controller: 'AseguradorasDetalleCtrl'
                    })                        
                    /***********************************************************************
                    *                            Consultas States                          *
                    ***********************************************************************/
                    .state('app.consultas', {
                        url: '/consultas',
                        templateUrl: 'templates/consultas/consultas.html',
                        controller: 'ConsultasCtrl'
                    })
                    .state('app.consulta-nuevo', {
                        url: '/consultas/nuevo',
                        templateUrl: 'templates/consultas/consulta-nuevo.html',
                        controller: 'ConsultasDetalleCtrl',
                        resolve: {
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }
                        }
                    })                   
                
                    .state('app.consulta-edit', {
                        url: '/consultas/editar/:id',
                        templateUrl: 'templates/consultas/consulta-editar.html',
                        controller: 'ConsultasDetalleCtrl',
                        resolve: {
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }
                        }
                    })                
                    /***********************************************************************
                    *                            Doctores States                           *
                    ***********************************************************************/             
                    .state('app.doctores', {
                        url: '/doctores',
                        templateUrl: 'templates/doctores/doctores.html',
                        controller: 'DoctoresCtrl',
                        resolve: {
                            doctores: function(doctoresFac) {
                                return doctoresFac.all();
                            },                            
                        }
                    })              
                    .state('app.doctor-nuevo', {
                        url: '/doctores/nuevo',
                        templateUrl: 'templates/doctores/doctor-nuevo.html',
                        controller: 'DoctoresDetalleCtrl',
                        resolve: {
                            especialidades: function(especialidadesFac) {
                                return especialidadesFac.all();
                            },
                            estadosCiviles: function(estadosCivilesFac) {
                                return estadosCivilesFac.all();
                            },
                            gruposSanguineos: function(gruposSanguineosFac) {
                                return gruposSanguineosFac.all();
                            },
                            paises: function(paisesFac) {
                                return paisesFac.all();
                            },
                            sexos: function(sexosFac) {
                                return sexosFac.all();
                            },
                            perfilesUsuarios: function(perfilesUsuariosFac) {
                                return perfilesUsuariosFac.all();
                            }                            
                        }
                    })    
                    .state('app.doctor-editar', {
                        url: '/doctores/editar/:id',
                        templateUrl: 'templates/doctores/doctor-editar.html',
                        controller: 'DoctoresDetalleCtrl',
                        resolve: {
                            especialidades: function(especialidadesFac) {
                                return especialidadesFac.all();
                            },
                            estadosCiviles: function(estadosCivilesFac) {
                                return estadosCivilesFac.all();
                            },
                            gruposSanguineos: function(gruposSanguineosFac) {
                                return gruposSanguineosFac.all();
                            },
                            paises: function(paisesFac) {
                                return paisesFac.all();
                            },
                            sexos: function(sexosFac) {
                                return sexosFac.all();
                            },
                            perfilesUsuarios: function(perfilesUsuariosFac) {
                                return perfilesUsuariosFac.all();
                            }                            
                        }                    
                    })
                    .state('app.doctor-perfil', {
                        url: '/doctores/perfil/:id',
                        templateUrl: 'templates/doctores/doctor-perfil.html',
                        controller: 'DoctoresDetalleCtrl',
                        resolve: {
                            deps: ['uiLoad',
                                function(uiLoad) {
                                    return uiLoad.load(['../bower_components/font-awesome/css/font-awesome.css']);
                                }
                            ],
                            especialidades: function(especialidadesFac) {
                                return especialidadesFac.all();
                            },
                            estadosCiviles: function(estadosCivilesFac) {
                                return estadosCivilesFac.all();
                            },
                            gruposSanguineos: function(gruposSanguineosFac) {
                                return gruposSanguineosFac.all();
                            },
                            paises: function(paisesFac) {
                                return paisesFac.all();
                            },
                            sexos: function(sexosFac) {
                                return sexosFac.all();
                            },
                            perfilesUsuarios: function(perfilesUsuariosFac) {
                                return perfilesUsuariosFac.all();
                            }                            
                        }
                    })
                
                    /***********************************************************************
                    *                            Facturas States                           *
                    ***********************************************************************/             
                    .state('app.facturas', {
                        url: '/facturas',
                        templateUrl: 'templates/facturas/facturas.html',
                        controller: 'FacturasCtrl',
                        resolve: {
                            facturas: function(facturasFac) {
                                return facturasFac.all();
                            }
                        }
                    })              
                    .state('app.factura-nuevo', {
                        url: '/facturas/nuevo',
                        templateUrl: 'templates/facturas/facturacion.html',
                        controller: 'FacturacionCtrl',
                        resolve: {                        
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            },
                            servicios: function(serviciosFac) {
                                return serviciosFac.all();
                            }
                        }
                    })    
                    .state('factura', {
                        url: '/facturas/:id',
                        templateUrl: 'templates/facturas/factura.html',
                        controller: 'FacturaCtrl'
                    })                
                    /************************************************************************
                    *                            Pacientes States                           *
                    ************************************************************************/
                    .state('app.pacientes', {
                        url: '/pacientes',
                        templateUrl: 'templates/pacientes/pacientes.html',
                        controller: 'PacientesCtrl',
                        resolve: {                        
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }
                        }
                    })
                    .state('app.pacientes-estado-cuenta', {
                        url: '/pacientes/estadocuenta',
                        templateUrl: 'templates/pacientes/paciente-estado-cuenta.html',
                        controller: 'PacientesDetalleCtrl',
                        resolve: {                        
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            },
                            aseguradoras: function(aseguradorasFac) {
                                return aseguradorasFac.all();
                            },
                            cuerpoPartes: function(cuerpoPartesFac) {
                                return cuerpoPartesFac.all();
                            },
                            enfermedades: function(enfermedadesFac) {
                                return enfermedadesFac.all();
                            },
                            estadosCiviles: function(estadosCivilesFac) {
                                return estadosCivilesFac.all();
                            },
                            gruposSanguineos: function(gruposSanguineosFac) {
                                return gruposSanguineosFac.all();
                            },
                            paises: function(paisesFac) {
                                return paisesFac.all();
                            },
                            sexos: function(sexosFac) {
                                return sexosFac.all();
                            }                            
                        }
                    })
                    .state('app.paciente-nuevo', {
                        url: '/pacientes/nuevo',
                        templateUrl: 'templates/pacientes/paciente-nuevo.html',
                        controller: 'PacientesDetalleCtrl',
                        resolve: {    
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            },                            
                            aseguradoras: function(aseguradorasFac) {
                                return aseguradorasFac.all();
                            },
                            cuerpoPartes: function(cuerpoPartesFac) {
                                return cuerpoPartesFac.all();
                            },
                            enfermedades: function(enfermedadesFac) {
                                return enfermedadesFac.all();
                            },
                            estadosCiviles: function(estadosCivilesFac) {
                                return estadosCivilesFac.all();
                            },
                            gruposSanguineos: function(gruposSanguineosFac) {
                                return gruposSanguineosFac.all();
                            },
                            paises: function(paisesFac) {
                                return paisesFac.all();
                            },
                            sexos: function(sexosFac) {
                                return sexosFac.all();
                            }
                        }
                    })    
                    .state('app.paciente-editar', {
                        url: '/pacientes/editar/:id',
                        templateUrl: 'templates/pacientes/paciente-editar.html',
                        controller: 'PacientesDetalleCtrl',
                        resolve: {
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            },                            
                            aseguradoras: function(aseguradorasFac) {
                                return aseguradorasFac.all();
                            },
                            cuerpoPartes: function(cuerpoPartesFac) {
                                return cuerpoPartesFac.all();
                            },
                            enfermedades: function(enfermedadesFac) {
                                return enfermedadesFac.all();
                            },
                            estadosCiviles: function(estadosCivilesFac) {
                                return estadosCivilesFac.all();
                            },
                            gruposSanguineos: function(gruposSanguineosFac) {
                                return gruposSanguineosFac.all();
                            },
                            paises: function(paisesFac) {
                                return paisesFac.all();
                            },
                            sexos: function(sexosFac) {
                                return sexosFac.all();
                            }                            
                        }                    
                    })
                    .state('app.paciente-perfil', {
                        url: '/pacientes/perfil/:id',
                        templateUrl: 'templates/pacientes/paciente-perfil.html',
                        controller: 'PacientesDetalleCtrl',
                        resolve: {
                            deps: ['uiLoad',
                                function(uiLoad) {
                                    return uiLoad.load(['../bower_components/font-awesome/css/font-awesome.css']);
                                }
                            ],
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            },                            
                            aseguradoras: function(aseguradorasFac) {
                                return aseguradorasFac.all();
                            },
                            cuerpoPartes: function(cuerpoPartesFac) {
                                return cuerpoPartesFac.all();
                            },
                            enfermedades: function(enfermedadesFac) {
                                return enfermedadesFac.all();
                            },
                            estadosCiviles: function(estadosCivilesFac) {
                                return estadosCivilesFac.all();
                            },
                            gruposSanguineos: function(gruposSanguineosFac) {
                                return gruposSanguineosFac.all();
                            },
                            paises: function(paisesFac) {
                                return paisesFac.all();
                            },
                            sexos: function(sexosFac) {
                                return sexosFac.all();
                            }                            
                        }
                    })
                    .state('paciente-perfil-print', {
                        url: '/pacientes/perfil/print/:id',
                        templateUrl: 'templates/pacientes/paciente-perfil-print.html',
                        controller: 'PacientesDetalleCtrl',
                        resolve: {
                            deps: ['uiLoad',
                                function(uiLoad) {
                                    return uiLoad.load(['../bower_components/font-awesome/css/font-awesome.css']);
                                }
                            ],
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            },                            
                            aseguradoras: function(aseguradorasFac) {
                                return aseguradorasFac.all();
                            },
                            cuerpoPartes: function(cuerpoPartesFac) {
                                return cuerpoPartesFac.all();
                            },
                            enfermedades: function(enfermedadesFac) {
                                return enfermedadesFac.all();
                            },
                            estadosCiviles: function(estadosCivilesFac) {
                                return estadosCivilesFac.all();
                            },
                            gruposSanguineos: function(gruposSanguineosFac) {
                                return gruposSanguineosFac.all();
                            },
                            paises: function(paisesFac) {
                                return paisesFac.all();
                            },
                            sexos: function(sexosFac) {
                                return sexosFac.all();
                            }                            
                        }
                    })  
                    /***********************************************************************
                    *                            Usuarios States                           *
                    ***********************************************************************/
                    .state('app.usuarios', {
                        url: '/usuarios',
                        templateUrl: 'templates/usuarios/usuarios.html',
                        controller: 'UsuariosCtrl'
                    })            
                    .state('app.usuario-nuevo', {
                        url: '/usuarios/nuevo',
                        templateUrl: 'templates/usuarios/usuario-nuevo.html',
                        controller: 'UsuariosDetalleCtrl',
                        resolve: {
                            perfilesUsuarios: function(perfilesUsuariosFac) {
                                return perfilesUsuariosFac.all();
                            }
                        }
                    })    
                    .state('app.usuario-edit', {
                        url: '/usuarios/editar/:id',
                        templateUrl: 'templates/usuarios/usuario-editar.html',
                        controller: 'UsuariosDetalleCtrl',
                        resolve: {
                            perfilesUsuarios: function(perfilesUsuariosFac) {
                                return perfilesUsuariosFac.all();
                            }
                        }                    
                    })                
                    /***********************************************************************
                    *                            Citas States                              *
                    ***********************************************************************/                
                    .state('app.cita-nuevo', {
                        url: '/citas/nuevo',
                        templateUrl: 'templates/citas/cita-nuevo.html',
                        controller: 'CitasDetalleCtrl',
                        resolve: {
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            },
                            doctores: function(doctoresFac) {
                                return doctoresFac.all();
                            }
                        }
                    })
                    .state('app.cita-editar', {
                        url: '/citas/editar/:id',
                        templateUrl: 'templates/citas/cita-editar.html',
                        controller: 'CitasDetalleCtrl',
                        resolve: {
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            },
                            doctores: function(doctoresFac) {
                                return doctoresFac.all();
                            }
                        }                    
                    })                
                    .state('app.citas', {
                        url: '/citas',
                        templateUrl: 'templates/citas/citas.html',
                        controller: 'CitasCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad', 'uiLoad',
                                function($ocLazyLoad, uiLoad) {
                                    return uiLoad.load(
                                        JQ_CONFIG.fullcalendar.concat('js/controllers/citas/citasController.js')
                                    ).then(
                                        function() {
                                            return $ocLazyLoad.load('ui.calendar');
                                        }
                                    )
                                }
                            ]
                        }
                    })
                    /***********************************************************************
                    *                            Terapias States                           *
                    ***********************************************************************/
                    .state('app.terapia-nuevo', {
                        url: '/terapias/nuevo',
                        templateUrl: 'templates/terapias/terapia-nuevo.html',
                        controller: 'TerapiasDetalleCtrl',
                        resolve: {
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }
                        }
                    })
                    .state('app.terapia-sesion-nuevo', {
                        url: '/terapias/:id/sesion/nueva',
                        templateUrl: 'templates/terapias/terapia-sesion-nuevo.html',
                        controller: 'TerapiasDetalleCtrl',
                        resolve: {
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }
                        }                    
                    })                
                    .state('app.terapias', {
                        url: '/terapias',
                        templateUrl: 'templates/terapias/terapias.html',
                        controller: 'TerapiasCtrl',
                        resolve: {
                            terapias: function(terapiasFac) {
                                return terapiasFac.all();
                            }
                        }                        
                    })
                    /***********************************************************************
                    *                            Pagos States                              *
                    ***********************************************************************/                
                    .state('pago', {
                        url: '/pagos/:id',
                        templateUrl: 'templates/pagos/recibo.html'
                    })
                
                    .state('app.pagos', {
                        url: '/pagos',
                        templateUrl: 'templates/pagos/pagos.html',
                        controller: 'PagosCtrl',
                        resolve: {
                            pagos: function(pagosFac) {
                                return pagosFac.all();
                            }   
                        }
                    })
                    .state('app.pago-nuevo', {
                        url: '/pagos/nuevo',
                        templateUrl: 'templates/pagos/pago-nuevo.html',
                        controller: 'PagoCtrl',
                        resolve: {
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            },
                            pagos: function(pagosFac) {
                                return pagosFac.all();
                            }                            
                        }                    
                    })    
                    /***********************************************************************
                    *                            Reportes States                           *
                    ***********************************************************************/                
                    .state('app.reportes', {
                        url: '/reportes',
                        templateUrl: 'templates/reportes/reportes.html'
                    })
                    .state('app.reportes-citas', {
                        url: '/reportes/citas',
                        templateUrl: 'templates/reportes/citas/citasListado.html',
                        controller: 'CitasReportesCtrl',
                        resolve: {
                            citas: function(citasFac) {
                                return citasFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }                            
                        }
                    })
                    .state('app.reportes-citas-realizadas', {
                        url: '/reportes/citas/realizadas',
                        templateUrl: 'templates/reportes/citas/citasRealizadasListado.html',
                        controller: 'CitasReportesCtrl',
                        resolve: {
                            citas: function(citasFac) {
                                return citasFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }                            
                        }
                    })
                    .state('app.reportes-citas-pendientes', {
                        url: '/reportes/citas/pendientes',
                        templateUrl: 'templates/reportes/citas/citasPendientesListado.html',
                        controller: 'CitasReportesCtrl',
                        resolve: {
                            citas: function(citasFac) {
                                return citasFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }                            
                        }
                    })                
                    .state('app.reportes-citas-canceladas', {
                        url: '/reportes/citas/canceladas',
                        templateUrl: 'templates/reportes/citas/citasCanceladasListado.html',
                        controller: 'CitasReportesCtrl',
                        resolve: {
                            citas: function(citasFac) {
                                return citasFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }                            
                        }
                    })
                    .state('app.reportes-citas-pacientes', {
                        url: '/reportes/citas/citasporpaciente',
                        templateUrl: 'templates/reportes/citas/citasPorPacienteListado.html',
                        controller: 'CitasReportesCtrl',
                        resolve: {
                            citas: function(citasFac) {
                                return citasFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }
                            
                        }
                    })                
                    .state('app.reportes-consultas', {
                        url: '/reportes/consultas',
                        templateUrl: 'templates/reportes/consultas/consultasListado.html',
                        controller: 'ConsultasReportesCtrl',
                        resolve: {
                            consultas: function(consultasFac) {
                                return consultasFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }                            
                        }
                    })
                    .state('app.reportes-consultas-pacientes', {
                        url: '/reportes/consultas/consultasporpaciente',
                        templateUrl: 'templates/reportes/consultas/consultasPorPacienteListado.html',
                        controller: 'ConsultasReportesCtrl',
                        resolve: {
                            consultas: function(consultasFac) {
                                return consultasFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }                            
                        }
                    })                
                    .state('app.reportes-pacientes', {
                        url: '/reportes/pacientes',
                        templateUrl: 'templates/reportes/pacientes/pacientesListado.html',
                        controller: 'PacientesReportesCtrl',
                        resolve: {
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }
                        }
                    })
                    .state('app.reportes-pacientes-perfiles', {
                        url: '/reportes/pacientes/perfiles',
                        templateUrl: 'templates/reportes/pacientes/pacientesPerfilesListado.html',
                        controller: 'PacientesReportesCtrl',
                        resolve: {
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }
                        }
                    })                
                    .state('app.reportes-facturas', {
                        url: '/reportes/facturas',
                        templateUrl: 'templates/reportes/facturas/facturasListado.html',
                        controller: 'FacturasReportesCtrl',
                        resolve: {
                            facturas: function(facturasFac) {
                                return facturasFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }                            
                        }
                    })
                    .state('app.reportes-facturas-anuladas', {
                        url: '/reportes/facturas/anuladas',
                        templateUrl: 'templates/reportes/facturas/facturasAnuladasListado.html',
                        controller: 'FacturasReportesCtrl',
                        resolve: {
                            facturas: function(facturasFac) {
                                return facturasFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }                            
                        }
                    })
                    .state('app.reportes-facturas-balance', {
                        url: '/reportes/facturas/balance',
                        templateUrl: 'templates/reportes/facturas/facturasBalanceListado.html',
                        controller: 'FacturasReportesCtrl',
                        resolve: {
                            facturas: function(facturasFac) {
                                return facturasFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }                            
                        }
                    })                
                    .state('app.reportes-facturas-saldadas', {
                        url: '/reportes/facturas/saldadas',
                        templateUrl: 'templates/reportes/facturas/facturasSaldadasListado.html',
                        controller: 'FacturasReportesCtrl',
                        resolve: {
                            facturas: function(facturasFac) {
                                return facturasFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }                            
                        }
                    })
                    .state('app.reportes-facturas-pacientes', {
                        url: '/reportes/facturas/facturasporpaciente',
                        templateUrl: 'templates/reportes/facturas/facturasPorPacienteListado.html',
                        controller: 'FacturasReportesCtrl',
                        resolve: {
                            facturas: function(facturasFac) {
                                return facturasFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }
                            
                        }
                    })
                    .state('app.reportes-ingresos-dia', {
                        url: '/reportes/ingresos/dia',
                        templateUrl: 'templates/reportes/ingresos/ingresosPorDia.html',
                        controller: 'IngresosReportesCtrl',
                        resolve: {
                            facturas: function(facturasFac) {
                                return facturasFac.all();
                            },
                            pagos: function(pagosFac) {
                                return pagosFac.all();
                            }                           
                        }
                    })
                    .state('app.reportes-ingresos-mes', {
                        url: '/reportes/ingresos/mes',
                        templateUrl: 'templates/reportes/ingresos/ingresosPorMes.html',
                        controller: 'IngresosReportesCtrl',
                        resolve: {
                            facturas: function(facturasFac) {
                                return facturasFac.all();
                            },
                            pagos: function(pagosFac) {
                                return pagosFac.all();
                            }                           
                        }
                    })                
                    .state('app.reportes-pagos', {
                        url: '/reportes/pagos',
                        templateUrl: 'templates/reportes/pagos/pagosListado.html',
                        controller: 'PagosReportesCtrl',
                        resolve: {
                            pagos: function(pagosFac) {
                                return pagosFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }                            
                        }
                    })
                    .state('app.reportes-pagos-anulados', {
                        url: '/reportes/pagos/anulados',
                        templateUrl: 'templates/reportes/pagos/pagosAnuladosListado.html',
                        controller: 'PagosReportesCtrl',
                        resolve: {
                            pagos: function(pagosFac) {
                                return pagosFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }                            
                        }
                    })
                    .state('app.reportes-pagos-pacientes', {
                        url: '/reportes/pagos/pagosporpaciente',
                        templateUrl: 'templates/reportes/pagos/pagosPorPacienteListado.html',
                        controller: 'PagosReportesCtrl',
                        resolve: {
                            pagos: function(pagosFac) {
                                return pagosFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }
                            
                        }
                    })
                    .state('app.reportes-terapias', {
                        url: '/reportes/terapias',
                        templateUrl: 'templates/reportes/terapias/terapiasListado.html',
                        controller: 'TerapiasReportesCtrl',
                        resolve: {
                            terapias: function(terapiasFac) {
                                return terapiasFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }                            
                        }
                    })
                    .state('app.reportes-terapias-pendientes', {
                        url: '/reportes/terapias/pendientes',
                        templateUrl: 'templates/reportes/terapias/terapiasPendientesListado.html',
                        controller: 'TerapiasReportesCtrl',
                        resolve: {
                            terapias: function(terapiasFac) {
                                return terapiasFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }                            
                        }
                    })
                    .state('app.reportes-terapias-completadas', {
                        url: '/reportes/terapias/completadas',
                        templateUrl: 'templates/reportes/terapias/terapiasCompletadasListado.html',
                        controller: 'TerapiasReportesCtrl',
                        resolve: {
                            terapias: function(terapiasFac) {
                                return terapiasFac.all();
                            },
                            pacientes: function(pacientesFac) {
                                return pacientesFac.all();
                            }                            
                        }
                    })                
                    /***********************************************************************
                    *                            Configuracion States                      *
                    ***********************************************************************/                
                    .state('app.configuracion', {
                        url: '/configuracion',
                        templateUrl: 'templates/configuracion/configuracion.html'
                    })
                
                    .state('app.configuracion-secuencias', {
                        url: '/configuracion/secuencias',
                        templateUrl: 'templates/configuracion/secuencias/secuencias.html',
                        controller: 'SecuenciasCtrl',
                        resolve: {
                            secuencias: function(secuenciasFac) {
                                return secuenciasFac.all();
                            }
                        }                    
                    })
                    .state('app.configuracion-secuencias-editar', {
                        url: '/configuracion/secuencias/editar/:id',
                        templateUrl: 'templates/configuracion/secuencias/secuencias-editar.html',
                        controller: 'SecuenciasDetalleCtrl'                
                    })
                    .state('app.configuracion-secuencias-nuevo', {
                        url: '/configuracion/secuencias/nuevo',
                        templateUrl: 'templates/configuracion/secuencias/secuencias-nuevo.html',
                        controller: 'SecuenciasDetalleCtrl'                
                    })
                
                    .state('app.configuracion-servicios', {
                        url: '/configuracion/servicios',
                        templateUrl: 'templates/configuracion/servicios/servicios.html',
                        controller: 'ServiciosCtrl',
                        resolve: {
                            servicios: function(serviciosFac) {
                                return serviciosFac.all();
                            }
                        }                    
                    })
                    .state('app.configuracion-servicios-editar', {
                        url: '/configuracion/servicios/editar/:id',
                        templateUrl: 'templates/configuracion/servicios/servicios-editar.html',
                        controller: 'ServiciosDetalleCtrl'                
                    })
                    .state('app.configuracion-servicios-nuevo', {
                        url: '/configuracion/servicios/nuevo',
                        templateUrl: 'templates/configuracion/servicios/servicios-nuevo.html',
                        controller: 'ServiciosDetalleCtrl'                
                    })                
                    .state('app.configuracion-enfermedades', {
                        url: '/configuracion/enfermedades',
                        templateUrl: 'templates/configuracion/enfermedades/enfermedades.html',
                        controller: 'EnfermedadesCtrl',
                        resolve: {
                            enfermedades: function(enfermedadesFac) {
                                return enfermedadesFac.all();
                            }
                        }                    
                    })
                    .state('app.configuracion-enfermedades-editar', {
                        url: '/configuracion/enfermedades/editar/:id',
                        templateUrl: 'templates/configuracion/enfermedades/enfermedad-editar.html',
                        controller: 'EnfermedadesDetalleCtrl'                
                    })
                    .state('app.configuracion-enfermedades-nuevo', {
                        url: '/configuracion/enfermedades/nuevo',
                        templateUrl: 'templates/configuracion/enfermedades/enfermedad-nuevo.html',
                        controller: 'EnfermedadesDetalleCtrl'                
                    })
                    .state('app.configuracion-especialidades', {
                        url: '/configuracion/especialidades',
                        templateUrl: 'templates/configuracion/especialidades/especialidades.html',
                        controller: 'EspecialidadesCtrl',
                        resolve: {
                            especialidades: function(especialidadesFac) {
                                return especialidadesFac.all();
                            }
                        }                    
                    })
                    .state('app.configuracion-especialidades-editar', {
                        url: '/configuracion/especialidades/editar/:id',
                        templateUrl: 'templates/configuracion/especialidades/especialidad-editar.html',
                        controller: 'EspecialidadesDetalleCtrl'                
                    })
                    .state('app.configuracion-especialidades-nuevo', {
                        url: '/configuracion/especialidades/nuevo',
                        templateUrl: 'templates/configuracion/especialidades/especialidad-nuevo.html',
                        controller: 'EspecialidadesDetalleCtrl'                
                    })
                
                    .state('app.hos-payments', {
                        url: '/hospital/payments',
                        templateUrl: 'partials/hos-payments.html'
                    })  
                    .state('app.hos-payment-add', {
                        url: '/hospital/payment-add',
                        templateUrl: 'partials/hos-payment-add.html',
                        controller: 'HospitalPaymentAddCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load('xeditable').then(
                                        function() {
                                            return $ocLazyLoad.load('js/controllers/facturas/facturacion.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.hos-patient-invoice', {
                        url: '/hospital/patient-invoice',
                        templateUrl: 'templates/hos-patient-invoice.html'
                    })   
                    .state('app.hos-events', {
                        url: '/hospital/events',
                        templateUrl: 'partials/hos-events.html',
                        resolve: {
                            deps: ['$ocLazyLoad', 'uiLoad',
                                function($ocLazyLoad, uiLoad) {
                                    return uiLoad.load(
                                        JQ_CONFIG.fullcalendar.concat('js/controllers/hos-events.js')
                                    ).then(
                                        function() {
                                            return $ocLazyLoad.load('ui.calendar');
                                        }
                                    )
                                }
                            ]
                        }
                    })

                    .state('app.hos-centres', {
                        url: '/hospital/centres',
                        templateUrl: 'partials/hos-centres.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load('js/controllers/hos-centres.js');
                                }
                            ]
                        }
                    })

                    .state('app.hos-report-patient', {
                        url: '/hospital/report-patient',
                        templateUrl: 'partials/hos-report-patient.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load('chart.js').then(
                                        function() {
                                            return $ocLazyLoad.load('js/controllers/hos-report-patient.js');
                                        }
                                    );
                                }
                            ]
                        }
                    }) 
                    .state('app.hos-report-hospital', {
                        url: '/hospital/report-hospital',
                        templateUrl: 'partials/hos-report-hospital.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load('chart.js').then(
                                        function() {
                                            return $ocLazyLoad.load('js/controllers/hos-report-hospital.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.hos-report-sales', {
                        url: '/hospital/report-sales',
                        templateUrl: 'partials/hos-report-sales.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['js/controllers/hos-report-sales.js']);
                                }
                            ]
                        }
                    })                 
                
            }
        ]
    );

// Adds state change hooks; logs to console.
app.run(function($rootScope, $state, $location, Auth) {
  $rootScope.$on("$stateChangeStart",   function(evt, to, toP, from, fromP)      {
      if (!Auth.isLoggedIn() && $location.path() !== '/login') {
        $location.path('/login');
      }
      else if (Auth.isLoggedIn() && $location.path() == "/login") {
          $location.path('/app/inicio')
      }
    });
});