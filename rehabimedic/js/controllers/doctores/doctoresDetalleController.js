app.controller('DoctoresDetalleCtrl', ['$scope', '$stateParams', '$window', '$timeout', '$filter', '$state', 'Notification', 'doctoresFac', 'especialidades', 'estadosCiviles', 'gruposSanguineos', 'paises', 'sexos', 'perfilesUsuarios', function($scope, $stateParams, $window, $timeout, $filter, $state, Notification, doctoresFac, especialidades, estadosCiviles, gruposSanguineos, paises, sexos, perfilesUsuarios) {
    
    $scope.especialidades = especialidades.data;
    $scope.estados_civiles = estadosCiviles.data;
    $scope.grupos_sanguineos = gruposSanguineos.data;
    $scope.perfilesUsuarios = perfilesUsuarios.data;
    $scope.paises = paises.data;
    $scope.sexos = sexos.data;
    $scope.doctor = {};
    
    $scope.calculateAge = function calculateAge() { // birthday is a date
        var birthday = $scope.doctor.persona_fecha_nacimiento;
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        ageDate = Math.abs(ageDate.getUTCFullYear() - 1970);
        $scope.doctor.persona_edad = ageDate;
    }
    
    $scope.closeAlert = function() {
        $scope.alert = false;
        console.log($scope.alert);
    }    
    
    if($stateParams.id) {
        doctoresFac.get(parseInt($stateParams.id,10))
        .then(
            function(response){
                d = new Date(response.data.persona.persona_fecha_nacimiento);
                d.setDate(d.getDate() + 1);
                response.data.persona.persona_fecha_nacimiento = d;
                $scope.doctor = response.data;
                $scope.doctor.persona_imagen_perfil = $scope.doctor.persona.persona_imagen_perfil;
                $scope.fecha_nacimiento = $filter('date')($scope.doctor.persona.persona_fecha_nacimiento,'dd-MM-yyyy');
                console.log($scope.doctor);
                
                angular.forEach(response.data.persona.personas_telefonos, function(value, key) {
                    if (value.tipo_telefono_id == 1) {
                        $scope.doctor.persona_telefono = value.telefono_numero;
                    }
                    else {
                        $scope.doctor.persona_celular = value.telefono_numero;
                    }
                });
                console.log($scope.doctor);
            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
            }
        );
    }
    
    $scope.setImage = function(element) {
        $scope.currentFile = element.files[0];
        var reader = new FileReader();
        
        reader.onload = function(event) {
            $scope.doctor.persona_imagen_perfil = event.target.result;
            $scope.$apply();
            console.log($scope.doctor.persona_imagen_perfil);
        }
        // when the file is read it triggers the onload event above.
        reader.readAsDataURL(element.files[0]);
    }
    
    $scope.clearImage = function() {
        angular.element("#trigger").val(null);
        $scope.doctor.persona_imagen_perfil = '';
        $scope.doctor.foto_editada = 1;
    }    
    
    $scope.save = function() {
        $scope.calculateAge();
        $scope.fecha_nacimiento = $scope.doctor.persona_fecha_nacimiento;  
        $scope.doctor.persona_fecha_nacimiento = $filter('date')($scope.doctor.persona_fecha_nacimiento,'yyyy-MM-dd');
        doctoresFac.save($scope.doctor)
        .then(
            function(response){
                console.log("doctor registrado!");
                console.log(response);
                console.log($scope.doctor);
                $timeout(function() {
                    $state.go('app.doctores');
                    console.log("State Changed");
                    Notification({
                        message: 'Doctor registrado correctamente!',
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
                console.log($scope.doctor);
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
        $scope.doctor.persona_fecha_nacimiento = $scope.fecha_nacimiento;
    }
    
    $scope.update = function() {
        
        $scope.doctor.persona_nombres = $scope.doctor.persona.persona_nombres;
        $scope.doctor.persona_apellidos = $scope.doctor.persona.persona_apellidos;
        $scope.doctor.persona_direccion = $scope.doctor.persona.persona_direccion;
        $scope.doctor.persona_correo_electronico = $scope.doctor.persona.persona_correo_electronico;
        $scope.doctor.persona_fecha_nacimiento = $scope.doctor.persona.persona_fecha_nacimiento;
        $scope.doctor.persona_edad = $scope.doctor.persona.persona_edad;
        $scope.doctor.sexo_id = $scope.doctor.persona.sexo_id;
        $scope.doctor.estado_civil_id = $scope.doctor.persona.estado_civil_id;
        $scope.doctor.pais_id = $scope.doctor.persona.pais_id;
        $scope.doctor.grupo_sanguineo_id = $scope.doctor.persona.grupo_sanguineo_id;
        //$scope.doctor.persona_imagen_perfil = $scope.doctor.persona.persona_imagen_perfil;
        $scope.doctor.contacto_nombre = $scope.doctor.persona.persona_contacto_emergencia.contacto_nombre;
        $scope.doctor.contacto_telefono = $scope.doctor.persona.persona_contacto_emergencia.contacto_telefono;
        
        $scope.calculateAge();
        $scope.fecha_nacimiento = $scope.doctor.persona_fecha_nacimiento;  
        $scope.doctor.persona_fecha_nacimiento = $filter('date')($scope.doctor.persona.persona_fecha_nacimiento,'yyyy-MM-dd');
        
        doctoresFac.update($scope.doctor, parseInt($stateParams.id,10))
        .then(
            function(response){
                console.log("doctor actualizado!");
                console.log(response);
                console.log($scope.doctor);
                $timeout(function() {
                    $state.go('app.doctores');
                    console.log("State Changed");
                    Notification({
                        message: 'Doctor actualizado correctamente!',
                        title: 'Registro Actualizado',
                        delay: 5000,
                        positionX: 'center',
                        positionY: 'top'
                    }, 'info');                    
                }, 1000, false);
            },
            function(response) {
                console.log("Error");
                console.log(response);
                console.log($scope.doctor);
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
        $scope.doctor.persona_fecha_nacimiento = $scope.fecha_nacimiento;
    }
    
    $scope.back = function() {
        $window.history.back();
    }
    
    $scope.startCamera = function () {
        // starting camera
        $scope.$broadcast('START_WEBCAM');
        console.log("Camara Iniciada!");
    };
    
    $scope.stopCamera = function () {
        // stopping camera
        $scope.$broadcast('STOP_WEBCAM');
        console.log("Camara Detenida!");
    };
    
    var _video = null;
    var patData = null;
    
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
        });
    };

    $scope.onStream = function (stream) {
        // You could do something manually with the stream.
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
            $scope.doctor.persona_imagen_perfil = patCanvas.toDataURL();
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
        $scope.doctor.file = imgBase64;
        console.log($scope.doctor.file);
    };
}])
function openWindow(){
document.getElementById("trigger").click();
}
