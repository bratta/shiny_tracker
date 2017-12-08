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
  .controller('MainCtrl', ['$scope', '$state', '$rootScope',
    function ($scope, $state, $rootScope) {
      $rootScope.getActiveTab = function() {
        return $state.current.data.activeTab;
      };
  }]);
