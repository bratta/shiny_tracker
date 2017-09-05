'use strict';
/*global moment */

/**
 * @ngdoc function
 * @name shinytrack.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of shinytrack
 */
angular.module('shinytrack')
  .controller('MainCtrl', ['$scope', '$state', '$rootScope', '$cookies', 'Settings',
    function ($scope, $state, $rootScope, $cookies, Settings) {
      $rootScope.settings = new Settings($cookies.getObject("settings"));
      $rootScope.$watch('settings', function() {
        $cookies.putObject("settings", $rootScope.settings, { expires: moment().add(1, 'year').toDate() });
      }, true);
      $rootScope.getActiveTab = function() {
        return $state.current.data.activeTab;
      };
  }]);
