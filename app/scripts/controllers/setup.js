'use strict';

/**
 * @ngdoc function
 * @name shinytrack.controller:SetupCtrl
 * @description
 * # SetupCtrl
 * Controller of shinytrack
 */
angular.module('shinytrack')
  .controller('SetupCtrl', ['$scope', '$state', '$rootScope', 'pokemon', 'deviceDetector',
    function ($scope, $state, $rootScope, pokemon, deviceDetector) {
      $scope.encounterMethods = [
        { text: "Random/SR", value: "random" },
        { text: "Masuda Method", value: "masuda" },
        { text: "Dex Nav", value: "dex_nav" },
        { text: "Friend Safari", value: "safari" },
        { text: "Radar Chaining", value: "radar" },
        { text: "Fishing", value: "fishing" },
        { text: "S.O.S Battles", value: "sos" }
      ];

      $scope.isMobile = deviceDetector.isMobile();

      $scope.resetSettings = function() {
        $rootScope.settings.reset();
      };
      pokemon.get({}, function(results) {
        $scope.pokemon = results;
      });
  }]);
