'use strict';

/**
 * @ngdoc function
 * @name shinytrack.controller:TrackCtrl
 * @description
 * # TrackCtrl
 * Controller of shinytrack
 */
angular.module('shinytrack')
  .controller('TrackCtrl', ['$scope', '$state', '$rootScope', '$uibModal',
    function ($scope, $state, $rootScope, $uibModal) {

      $scope.incEncounters = function() {
        $rootScope.settings.encounters = $rootScope.settings.encounters + 1;
      };

      $scope.decEncounters = function() {
        if ($rootScope.settings.encounters > 0) {
          $rootScope.settings.encounters = $rootScope.settings.encounters - 1;
        }
      };

      $scope.editEncounters = function() {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/encounter-modal.html',
          controller: 'EncounterModalCtrl'
        });
      };
  }]);
