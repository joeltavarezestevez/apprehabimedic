app.controller('PacientesDetalleCtrl', ['$scope', '$state', '$stateParams', '$filter' ,'$window', '$timeout', 'Notification', 'pacientesFac', 'pacientesImagenesFac', 'aseguradoras', 'cuerpoPartes', 'enfermedades', 'estadosCiviles', 'gruposSanguineos', 'paises', 'sexos', function($scope, $state, $stateParams, $filter, $window, $timeout, Notification, pacientesFac, pacientesImagenesFac, aseguradoras, cuerpoPartes, enfermedades, estadosCiviles, gruposSanguineos, paises, sexos) {

    $scope.alert = false;
    $scope.paciente = {};
    $scope.paciente.referencia_tipo = "ninguno";
    $scope.paciente.paciente_empleo_estado = 0;
    $scope.paciente.seguro = 0;
    
    //loading data
    $scope.aseguradoras = aseguradoras.data;
    $scope.cuerpo_partes = cuerpoPartes.data;
    $scope.enfermedades = enfermedades.data;
    $scope.estados_civiles = estadosCiviles.data;
    $scope.grupos_sanguineos = gruposSanguineos.data;
    $scope.paises = paises.data;
    $scope.sexos = sexos.data;
    
    $scope.closeAlert = function() {
        $scope.alert = false;
        console.log($scope.alert);
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
    
    if($stateParams.id) {
        pacientesFac.get(parseInt($stateParams.id,10))
        .then(
            function(response){
                d = new Date(response.data.persona.persona_fecha_nacimiento);
                d.setDate(d.getDate() + 1);
                response.data.persona.persona_fecha_nacimiento = d;
                $scope.paciente = response.data;
                $scope.paciente.persona_imagen_perfil = $scope.paciente.persona.persona_imagen_perfil;
                $scope.fecha_nacimiento = $filter('date')($scope.paciente.persona.persona_fecha_nacimiento,'dd-MM-yyyy');
                
                $scope.paciente.enfermedad_id = [];
                angular.forEach(response.data.pacientes_enfermedades, function(value, key) {
                    $scope.paciente.enfermedad_id.push(value.enfermedad_id.toString());
                });
                
                $scope.paciente.cirugias = [];
                angular.forEach(response.data.pacientes_cirugias, function(value, key) {
                    $scope.paciente.cirugias.push(value.cirugia_descripcion.toString());
                });
                
                if(response.data.pacientes_fracturas.length > 0){
                    $scope.paciente.fractura = 1;
                    $scope.paciente.fracturas = [];
                    angular.forEach(response.data.pacientes_fracturas, function(value, key) {
                        $scope.paciente.fracturas.push(value.cuerpo_parte_id.toString());
                    });                    
                }
                else {
                    $scope.paciente.fractura = 2;
                }
                
                angular.forEach(response.data.persona.personas_telefonos, function(value, key) {
                    if (value.tipo_telefono_id == 1) {
                        $scope.paciente.persona_telefono = value.telefono_numero;
                    }
                    else {
                        $scope.paciente.persona_celular = value.telefono_numero;
                    }
                });

                if($scope.paciente.aseguradora_id != 1) {
                    $scope.paciente.seguro = 1;
                }
                else {
                    $scope.paciente.seguro = 0;
                }
                
                if($scope.paciente.paciente_referencia == null) {
                    $scope.paciente.referencia_tipo = "ninguno";
                }
                else {
                    $scope.paciente.referencia_tipo = $scope.paciente.paciente_referencia.referencia_tipo;
                    $scope.paciente.persona_referencia = $scope.paciente.paciente_referencia.persona_referencia;
                }
                
                if($scope.paciente.pacientes_fracturas.length == 0){
                    $scope.paciente.fractura = 2;
                }
                console.log($scope.paciente);
            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
            }
        );
    }
    
    $scope.calculateAge = function calculateAge() { // birthday is a date
        var birthday = $scope.paciente.persona_fecha_nacimiento;
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        ageDate = Math.abs(ageDate.getUTCFullYear() - 1970);
        $scope.paciente.persona_edad = ageDate;
    }
    
    $scope.print = function() {
        $scope.paciente.estado_id = 1;
        //$scope.calculateAge();
        console.log($scope.paciente);
    }    
    
    $scope.setImage = function(element) {
        $scope.currentFile = element.files[0];
        var reader = new FileReader();
        
        reader.onload = function(event) {
            $scope.paciente.persona_imagen_perfil = event.target.result;
            $scope.$apply();
            console.log($scope.paciente.persona_imagen_perfil);
        }
        // when the file is read it triggers the onload event above.
        reader.readAsDataURL(element.files[0]);
    }
    
    
    $scope.setFile = function(element) {
        $scope.currentFile = element.files[0];
        $scope.paciente.extension = $scope.currentFile.name.substr($scope.currentFile.name.lastIndexOf('.')+1)
        console.log($scope.paciente.extension);
        
        var reader = new FileReader();
        
        reader.onload = function(event) {
            $scope.paciente.archivo = event.target.result;
            $scope.$apply();
            //console.log($scope.paciente.archivo);
        }
        // when the file is read it triggers the onload event above.
        reader.readAsDataURL(element.files[0]);
    }    
    
    
    $scope.clearImage = function() {
        angular.element("#trigger").val(null);
        $scope.paciente.persona_imagen_perfil = '';
    }
    
    $scope.clearFile = function() {
        angular.element("#archivo").val(null);
        $scope.paciente.archivo = '';
    }
    
    $scope.saveFile = function() {
        $scope.paciente.paciente_id = $scope.paciente.id;
        console.log($scope.paciente);
        
        pacientesImagenesFac.save($scope.paciente)
        .then(
            function(response){
                console.log("Documento registrado!");
                console.log(response);
                console.log($scope.paciente);
                $timeout(function() {
                    $state.reload();
                    Notification({
                        message: 'Documento cargado correctamente!',
                        title: 'Registro realizado',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'success');                    
                }, 1000, false);
            },
            function(response){
                console.log("Error");
                console.log(response);
                console.log($scope.paciente);
                if(response.status == 400 && response.data.message){
                    Notification({
                        message: 'Errores al intentar crear el registro. Revise los mensajes arriba.',
                        title: 'Error',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'error');
                    console.log('Errol manin!');
                    $scope.alert = true;
                    $scope.mensajes = response.data.message;
                }
            }
        );        
        
        
    }
    
    $scope.save = function() {
        $scope.calculateAge();
        $scope.fecha_nacimiento = $scope.paciente.persona_fecha_nacimiento;  
        $scope.paciente.persona_fecha_nacimiento = $filter('date')($scope.paciente.persona_fecha_nacimiento,'yyyy-MM-dd');
        
        if ($scope.paciente.cirugias && !Array.isArray($scope.paciente.cirugias)){
            $scope.paciente.cirugias = $scope.paciente.cirugias.split(",");   
        }
        pacientesFac.save($scope.paciente)
        .then(
            function(response){
                console.log("paciente registrado!");
                console.log(response);
                console.log($scope.paciente);
                $timeout(function() {
                    $state.go('app.pacientes');
                    console.log("State Changed");
                    Notification({
                        message: 'Paciente registrado correctamente!',
                        title: 'Registro realizado',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'success');                    
                }, 1000, false);
            },
            function(response){
                console.log("Error");
                console.log(response);
                console.log($scope.paciente);
                if(response.status == 400 && response.data.message){
                    Notification({
                        message: 'Errores al intentar crear el registro. Revise los mensajes arriba.',
                        title: 'Error',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'error');
                    console.log('Errol manin!');
                    $scope.alert = true;
                    $scope.mensajes = response.data.message;
                }
            }
        );
        $scope.paciente.persona_fecha_nacimiento = $scope.fecha_nacimiento;
    }
    
    $scope.update = function() {
        
        $scope.paciente.persona_nombres = $scope.paciente.persona.persona_nombres;
        $scope.paciente.persona_apellidos = $scope.paciente.persona.persona_apellidos;
        $scope.paciente.persona_direccion = $scope.paciente.persona.persona_direccion;
        $scope.paciente.persona_correo_electronico = $scope.paciente.persona.persona_correo_electronico;
        $scope.paciente.persona_fecha_nacimiento = $scope.paciente.persona.persona_fecha_nacimiento;
        $scope.paciente.persona_edad = $scope.paciente.persona.persona_edad;
        $scope.paciente.sexo_id = $scope.paciente.persona.sexo_id;
        $scope.paciente.estado_civil_id = $scope.paciente.persona.estado_civil_id;
        $scope.paciente.pais_id = $scope.paciente.persona.pais_id;
        $scope.paciente.grupo_sanguineo_id = $scope.paciente.persona.grupo_sanguineo_id;
        //$scope.paciente.persona_imagen_perfil = $scope.paciente.persona.persona_imagen_perfil;
        $scope.paciente.contacto_nombre = $scope.paciente.persona.persona_contacto_emergencia.contacto_nombre;
        $scope.paciente.contacto_telefono = $scope.paciente.persona.persona_contacto_emergencia.contacto_telefono;
        if ($scope.paciente.paciente_empleo != null) {
            $scope.paciente.tipo_empleado_id = $scope.paciente.paciente_empleo.tipo_empleado_id;
            $scope.paciente.paciente_empleo_empresa = $scope.paciente.paciente_empleo.paciente_empleo_empresa;
            $scope.paciente.paciente_empleo_empresa_direccion = $scope.paciente.paciente_empleo.paciente_empleo_empresa_direccion;
            $scope.paciente.paciente_empleo_empresa_telefono = $scope.paciente.paciente_empleo.paciente_empleo_empresa_telefono;
            $scope.paciente.paciente_empleo_empresa_tiempo = $scope.paciente.paciente_empleo.paciente_empleo_empresa_tiempo;
            $scope.paciente.paciente_empleo_horario = $scope.paciente.paciente_empleo.paciente_empleo_horario;
            $scope.paciente.paciente_empleo_jornada = $scope.paciente.paciente_empleo.paciente_empleo_jornada;
        }
        if (!Array.isArray($scope.paciente.cirugias)){
            $scope.paciente.cirugias = $scope.paciente.cirugias.split(",");   
        }
        
        $scope.calculateAge();
        $scope.paciente.estado_id = 1;
        $scope.fecha_nacimiento = $scope.paciente.persona_fecha_nacimiento;  
        $scope.paciente.persona_fecha_nacimiento = $filter('date')($scope.paciente.persona.persona_fecha_nacimiento,'yyyy-MM-dd');
        
        pacientesFac.update($scope.paciente, parseInt($stateParams.id,10))
        .then(
            function(response){
                console.log("paciente actualizado!");
                console.log(response);
                console.log($scope.paciente);
                $timeout(function() {
                    $state.go('app.pacientes');
                    console.log("State Changed");
                    Notification({
                        message: 'Paciente actualizado correctamente!',
                        title: 'Registro Actualizado',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'info');                    
                }, 1000, false);
            },
            function(response) {
                console.log("Error");
                console.log(response.data);
                console.log($scope.paciente);
                if(response.status == 400 && response.data.message){
                    Notification({
                        message: 'Errores al intentar actualizar el registro. Revise los mensajes arriba.',
                        title: 'Error',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'error');
                    console.log('Errol manin!');
                    $scope.alert = true;
                    $scope.mensajes = response.data.message;
                }
            }
        );
        $scope.paciente.persona_fecha_nacimiento = $scope.fecha_nacimiento;
    }
    
    $scope.back = function() {
        $window.history.back();
    }
    
    var _video = null,
        patData = null;
    
    $scope.streaming = true;
    $scope.snapshotData;    
    $scope.patOpts = {x: 0, y: 0, w: 25, h: 25};

    // Setup a channel to receive a video property
    // with a reference to the video element
    // See the HTML binding in main.html
    $scope.channel = {};

    $scope.webcamError = false;
    $scope.onError = function (err) {
        $scope.$apply(
            function() {
                $scope.webcamError = err;
            }
        );
    };

    $scope.onSuccess = function () {
        // The video element contains the captured camera data
        _video = $scope.channel.video;
        $scope.$apply(function() {
            $scope.patOpts.w = _video.width;
            $scope.patOpts.h = _video.height;
            //$scope.showDemos = true;
            console.log(_video);
        });
    };

    $scope.onStream = function (stream) {
        // You could do something manually with the stream.
        console.log(stream);
    };

	$scope.makeSnapshot = function() {
        if (_video) {
            var patCanvas = document.querySelector('#snapshot');
            if (!patCanvas) return;

            patCanvas.width = _video.width;
            patCanvas.height = _video.height;
            var ctxPat = patCanvas.getContext('2d');

            var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
            ctxPat.putImageData(idata, 0, 0);
            $scope.paciente.persona_imagen_perfil = patCanvas.toDataURL();
            console.log($scope.paciente.persona_imagen_perfil);
            sendSnapshotToServer(patCanvas.toDataURL());

            patData = idata;
        }
        console.log("picture taked");        
        $scope.streaming = false;
    };
    
    /**
     * Redirect the browser to the URL given.
     * Used to download the image by passing a dataURL string
     */
    $scope.downloadSnapshot = function downloadSnapshot(dataURL) {
        window.location.href = dataURL;
    };
    
    
    var getVideoData = function getVideoData(x, y, w, h) {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = _video.width;
        hiddenCanvas.height = _video.height;
        var ctx = hiddenCanvas.getContext('2d');
        ctx.drawImage(_video, 0, 0, _video.width, _video.height);
        return ctx.getImageData(x, y, w, h);
    };

    /**
     * This function could be used to send the image data
     * to a backend server that expects base64 encoded images.
     *
     * In this example, we simply store it in the scope for display.
     */
    var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
        $scope.snapshotData = imgBase64;
    };
}])

function openWindow(){
document.getElementById("trigger").click();
}