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
          generation: 8, shiny_charm: false, encounters: 0, encounter_method: "random", target: "", start_date: new Date(), show_stats: true, dark_theme: false
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
        if (this.generation === 6 || this.generation === 7 || this.generation === 8) {
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

      // Generation 8 has static odd increases based on encounters
      if (this.encounter_method === "random" && this.generation === 8) {
        if (this.encounters <= 50) {
          odds = (this.shiny_charm == true) ? 1024 : 2048;
        } else if (this.encounters <= 100 && this.encounters > 50) {
          odds = (this.shiny_charm == true) ? 819.2 : 1365.333;
        } else if (this.encounters <= 200 && this.encounters > 100) {
          odds = (this.shiny_charm == true) ? 682.6667 : 1024;
        } else if (this.encounters <= 300 && this.encounters > 200) {
          odds = (this.shiny_charm == true) ? 585.1429 : 819.2;
        } else if (this.encounters <= 500 && this.encounters > 300) {
          odds = (this.shiny_charm == true) ? 512 : 682.6667;
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
      var target_filename = (this.target || "").toLowerCase().replace(/[^-0-9a-zA-Z_]/g, '');
      var alolan_forms = [ "raticate", "raichu", "vulpix", "sandslash", "sandshrew", "rattata", "persian", "ninetales", "muk", "meowth", "marowak", "grimer", "graveler", "golem", "geodude", "exeggutor", "dugtrio", "diglett" ];
      var galarian_forms = [ "zigzagoon", "weezing", "ponyta", "rapidash", "farfetchd", "mrmime", "yamask", "corsola", "darumaka", "darmanitan", "meowth", "stunfisk" ];
      var galarian_pokemon = [
        "grookey", "thwackey", "rillaboom", "scorbunny", "raboot", "cinderace", "sobble", "drizzile", "inteleon", "blipbug",
        "dottler", "orbeetle", "rookidee", "corvisquire", "corviknight", "skwovet", "greedent", "nickit", "thievul",
        "obstagoon", "wooloo", "dubwool", "chewtle", "drednaw", "yamper", "boltund", "gossifleur", "eldegoss", "sizzlipede",
        "centiskorch", "rolycoly", "carkol", "coalossal", "arrokuda", "barraskewda", "perrserker", "milcery", "alcremie",
        "applin", "flapple", "appletun", "sirfetchd", "cursola", "impidimp", "morgrem", "grimmsnarl", "hatenna",
        "hattrem", "hatterene", "cufant", "copperajah", "cramorant", "toxel", "toxtricity", "silicobra", "sandaconda",
        "runerigus", "sinistea", "polteageist", "indeedee", "morpeko", "falinks", "snom", "frosmoth", "clobbopus", "grapploct",
        "pincurchin", "mrrime", "stonjourner", "eiscue", "duraludon", "dracozolt", "arctozolt", "dracovish", "arctovish",
        "dreepy", "drakloak", "dragapult", "zacian", "zamazenta", "eternatus"
      ];
      if (this.generation === 7) {
        if (_(alolan_forms).contains(target_filename)) {
          target_filename = target_filename + "-alola";
        }
      }

      // FIXME: Currently we only have .png files for
      // the Galarian Pokemon. Fix this when we have proper gifs
      if (_(galarian_forms.concat(galarian_pokemon)).contains(target_filename)) {
        if (_(galarian_forms).contains(target_filename)) {
          target_filename = target_filename + "-galar";
        }
        target_filename = target_filename + ".png";
      } else {
        target_filename = target_filename + ".gif";
      }

      return target_filename;
    };

    return Settings;
  });
