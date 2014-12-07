/**
 * Created by rafik-naccache on 07/12/14.
 */
var players = require('players');
var entities = require('entities');

describe('players Test Suite', function () {


    an_attack_apt = new entities.Aptitude({
        name: "attack",
        description: "blah blah",
        price: 10
    });

    a_defense_apt = new entities.Aptitude({
        name: "defend",
        description: "blah blah",
        price: 10
    });


    a_vuln = new entities.Vulnerability({
        name: "vuln",
        description: "blah blah 2"

    });

    var rafikentity = new entities.Entity({
        name: "rafikentity",
        x: 10,
        y: 20,
        is_serverp: true,
        is_goodp: false,
        aptitudes: [an_attack_apt],
        vulnerabilities: [],
        webmana: 20,
        his_player_id: "rafikplayer"
    });


    var elyesentity = new entities.Entity({
        name: "elyesentity",
        x: 10,
        y: 20,
        is_serverp: false,
        is_goodp: true,
        aptitudes: [a_defense_apt],
        vulnerabilities: [a_vuln],
        webmana: 20,
        his_player_id: "elyesIDplayer"
    });


    var rafik = new players.Player({
        name: "rafik",
        game_id: "game1",
        entities: [rafikentity],
        webmana: 20
    });


    var elyes = new players.Player({
        name: "elyes",
        game_id: "game1",
        entities: [elyesentity],
        webmana: 20
    });


    it('Attack is correct',function(){
        var an_attack;
        an_attack = rafik.attack(rafikentity,an_attack_apt,elyes,elyesentity,a_vuln);
         expect(an_attack.name).toBe('rafik:rafikentity:attack->elyes:elyesentity:vuln');

    });

    it('A defense is correct', function(){
        var an_attack;
        an_attack = rafik.attack(rafikentity,an_attack_apt,elyes,elyesentity,a_vuln);
       var a_defense = elyes.defend(an_attack,a_defense_apt);
        expect(a_defense.name).toBe('elyes:defend||rafik:rafikentity:attack->elyes:elyesentity:vuln')
    });


    it('A transaction is correct', function () {
        var a_transact;
        a_transact = rafik.transact(rafikentity,an_attack_apt,elyes,elyesentity,a_defense_apt);
        expect(a_transact.name).toBe('rafik:rafikentity:attack<->elyes:elyesentity:defend');
    })
});