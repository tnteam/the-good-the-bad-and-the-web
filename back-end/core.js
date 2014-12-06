/**
 * Created by rafik-naccache on 06/12/14.
 */

var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});

requirejs(['entities','players','underscore'],
function   (entities,players,underscore) {
    //foo and bar are loaded according to requirejs
    //config, but if not found, then node's require
    //is used to load the module.

    var entity = entities.Entity();
});
