'use strict';

/**
 * @ngdoc overview
 * @name shinytrack
 * @description
 * # shinytrack
 *
 * Main module of the application.
 */

angular
  .module('shinytrack', [
    'ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch',
    'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'ui.router', 'underscore.string', 'angularMoment',
    'ng.deviceDetector'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider',
    function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
      $urlMatcherFactoryProvider.strictMode(false); //makes routes work with trailing slashes

      $urlRouterProvider
        .when('/', '/shiny/track')
        .when('', '/shiny/track')
        .otherwise('/shiny/track');

        $stateProvider
          .state('shiny', {
            url: "/shiny",
            templateUrl: "partials/shiny.html",
            controller: "MainCtrl"
          })
          .state('shiny.setup', {
            url: "/setup",
            templateUrl: "partials/setup.html",
            controller: "SetupCtrl",
            data: {
              activeTab: "setup"
            }
          })
          .state('shiny.track', {
            url: "/track",
            templateUrl: "partials/track.html",
            controller: "TrackCtrl",
            data: {
              activeTab: "track"
            }
          })
          .state('shiny.about', {
            url: "/about",
            templateUrl: "partials/about.html",
            data: {
              activeTab: "about"
            }
          });
  }]);
