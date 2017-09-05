'use strict';

/**
 * @ngdoc function
 * @name shinytrack.controller:EncounterModalCtrl
 * @description
 * # EncounterModalCtrl
 * Controller of shinytrack
 */
angular.module('shinytrack')
  .controller('EncounterModalCtrl', ['$scope', '$rootScope', '$modalInstance',
    function ($scope, $rootScope, $modalInstance) {
      $scope.originalSettings = angular.copy($rootScope.settings);

      $scope.modalSave = function() {
        $modalInstance.close();
      };

      $scope.modalCancel = function() {
        $rootScope.settings = angular.copy($scope.originalSettings);
        $modalInstance.dismiss('cancel');
      };
    }]);
