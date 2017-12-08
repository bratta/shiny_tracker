'use strict';
/*global Fraction */
/*global _ */

/**
 * @ngdoc overview
 * @name Settings
 * @description
 * # shinytrack
 *
 * Provides the Settings model
 */
angular.module("shinytrack")
  .factory("Settings", function() {
    var Settings = function(params) {
      this.init(params);
    };

    Settings.prototype.init = function(params) {
      if (_(params).isEmpty()) {
        params = {
          generation: 7, shiny_charm: false, encounters: 0, encounter_method: "random", target: "", start_date: new Date(), show_stats: true, dark_theme: false
        };
      }
      this.generation = params.generation;
      this.shiny_charm = params.shiny_charm;
      this.encounters = params.encounters;
      this.encounter_method = params.encounter_method;
      this.target = params.target;
      this.start_date = new Date(params.start_date);
      this.show_stats = params.show_stats;
      this.dark_theme = params.dark_theme;
    };

    Settings.prototype.reset = function() {
      this.init({});
    };

    Settings.prototype.odds = function() {
      var odds = 8192;

      // Random Encounters and Soft Resets
      if (this.generation === 6 || this.generation === 7) {
        odds = 4096;
      }
      if (this.shiny_charm === true && this.generation === 5) {
        odds = 2731;
      }
      if (this.shiny_charm === true && (this.generation === 6 || this.generation === 7)) {
        odds = 1365;
      }

      // Masuda Method
      if (this.encounter_method === "masuda") {
        if (this.generation === 4) {
          odds = 1638;
        }
        if (this.generation === 5) {
          if (this.shiny_charm === true) {
            odds = 1024;
          } else {
            odds = 1365;
          }
        }
        if (this.generation === 6 || this.generation === 7) {
          if (this.shiny_charm === true) {
            odds = 512;
          } else {
            odds = 683;
          }
        }
      }

      // Friend Safari
      if (this.encounter_method === "safari") {
        odds = 512;
      }

      // Dex Nav -- unsure of the legitimacy of this
      if (this.encounter_method === "dex_nav") {
        odds = 512;
      }

      // Radar chaining
      // Chain fishing is speculated to be the same
      if (this.encounter_method === "radar" || this.encounter_method === "fishing") {
        // Values for the formula:
        // Math.ceil(65535 / (8200 - nc * 200)) / 65536
        // where nc = number in the chain, up to 40

        var nc = this.encounters;
        if (nc < 0) {
          nc = 0;
        }
        if (nc > 40) {
          nc = 40;
        }
        var f = new Fraction(Math.ceil(65535 / (8200 - nc * 200)) / 65536);
        odds = Math.ceil(f.d/f.n);

        if (this.generation === 6) {
          odds = odds/2;
        }

        if (this.shiny_charm === true) {
          f = new Fraction(3, odds);
          odds = Math.ceil(f.d/f.n);
        }
      }

      // S.O.S Battles
      if (this.encounter_method === "sos") {
        var chained_encounter = this.encounters % 256;
        if (chained_encounter  >= 70) {
          if (this.shiny_charm === true) {
            odds = 683;
          } else {
            odds = 1024;
          }
        }
      }
      return new Fraction(1, Math.ceil(odds));
    };

    Settings.prototype.binomial_distribution_percentage = function() {
      var p = this.odds().valueOf();
      var n = this.encounters;
      var p_to_n = Math.pow((1.0 - p), n);
      return (p_to_n * (Math.pow((-(1.0/(p-1.0))), n)) - p_to_n) * 100.0;
    };

    Settings.prototype.remaining_encounters = function() {
      var p = this.odds().valueOf();
      var n = Math.ceil(Math.log(0.1) / Math.log(1-p));
      return n - this.encounters;
    };

    Settings.prototype.target_filename = function() {
      var target_filename = (this.target || "").toLowerCase().replace(/[^-0-9a-zA-Z_\s]/g, '');
      var alolan_forms = [ "raticate", "raichu", "vulpix", "sandslash", "sandshrew", "rattata", "persian", "ninetales", "muk", "meowth", "marowak", "grimer", "graveler", "golem", "geodude", "exeggutor", "dugtrio", "diglett" ];
      if (this.generation === 7) {
        if (_(alolan_forms).contains(target_filename)) {
          target_filename = target_filename + "-alola";
        }
      }
      target_filename = target_filename + ".gif";
      return target_filename;
    };

    return Settings;
  });
