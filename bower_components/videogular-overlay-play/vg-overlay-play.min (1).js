"use strict";angular.module("com.2fdevs.videogular.plugins.overlayplay",[]).run(["$templateCache",function(a){a.put("vg-templates/vg-overlay-play",'<div class="overlayPlayContainer" ng-click="onClickOverlayPlay()">              <div class="iconButton" ng-class="overlayPlayIcon"></div>            </div>')}]).directive("vgOverlayPlay",["VG_STATES",function(a){return{restrict:"E",require:"^videogular",scope:{},templateUrl:function(a,b){return b.vgTemplate||"vg-templates/vg-overlay-play"},link:function(b,c,d,e){b.onChangeState=function(c){switch(c){case a.PLAY:b.overlayPlayIcon={};break;case a.PAUSE:b.overlayPlayIcon={play:!0};break;case a.STOP:b.overlayPlayIcon={play:!0}}},b.onClickOverlayPlay=function(a){e.playPause()},b.overlayPlayIcon={play:!0},b.$watch(function(){return e.currentState},function(a,c){b.onChangeState(a)})}}}]);