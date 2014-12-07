/**
 * Created by rafik-naccache on 07/12/14.
 */

var game_data = require('game-data');
var utils = require('utils');


describe("Entites Test Suite", function() {

    it('Should defense for  exploit_user exist, user_updates_patches and returns {source:-5,target:20}', function() {
        rules = new game_data.init_data();
        var attack = rules.exploit_user;
        var defense = rules.user_updates_patches;
        var possible_defense = rules.possible_defenses[utils.hash_obj_tuple(attack,defense)];
        expect(possible_defense.source).toBe(-5);
        expect(possible_defense.target).toBe(20);
    });

    it('should return fals when there is no possible attack on a vuln', function(){
        var attack = rules.exploit_user;
        var vuln = rules.user_w_cookies;
        expect(rules.possible_attacks[utils.hash_obj_tuple(attack,vuln)]).toBe(undefined);

    });
});