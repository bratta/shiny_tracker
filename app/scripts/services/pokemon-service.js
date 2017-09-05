'use strict';

/**
 * @ngdoc function
 * @name shinytrack.service:PokemonService
 * @description
 * # PokemonService
 * Service of shinytrack
 */
angular.module("shinytrack")
  .factory('pokemon', ['$resource',
    function($resource) {
      return $resource('/pokemon.json', {}, {
        get: { method: "GET", isArray: true }
      });
    }
  ]);
