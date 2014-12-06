/**
 * Created by rafik-naccache on 06/12/14.
 */
'use strict';
var requirejs = require ("requirejs");
var assert = require ("assert")

requirejs.config({
    baseUrl: '.',
    nodeRequire: require
});

suite('test', function() {

    it('sould be cool', function() {
        assert (true == false);
    });
});