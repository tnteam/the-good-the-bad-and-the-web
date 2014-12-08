/**
 * Created by rafik-naccache on 06/12/14.
 */
var game_data = require('game-data');
var game = require('game');
var entities = require('entities')
var players = require('players');
var _ = require('underscore');
var utils = require('utils');
var app = require('express.io')();
var board = new game.Board();
var rules = new game_data.init_data();

process.on('uncaughtException', function (err) {
    // handle the error safely
    console.log(err);
});


app.http().io();

app.io.route('player', {
    register: function (req) {
        var params = req.data;
        var name = params.name;
        var game_id = params.game_id;
        var webmana = parseInt(params.webmana);
        var player_params = {name: name, game_id: game_id, entities: [], webmana: webmana};
        var player = new players.Player(player_params);
        var result = board.add_player(player);
        var response = {result: result, data: utils.transform_obj_to_name(player, 'entities')};
        app.io.broadcast('player:register', response);
    }
});

app.io.route('entity', {
    add: function (req) {
        var params = req.data;
        var his_player_id = params.his_player_id;
        var his_player = _.find(board.players, function (pl) {
            return (pl.name == his_player_id);
        });

        var result = false;
        var response = {};
        var entity_name = params.name;

        var exist_entity = _.some(board.all_entities(), function (ent) {
            return ent.name == entity_name
        });

        if (his_player && !exist_entity) {

            params.vulnerabilities = _.sample(rules.all_vulnerabilities(), 3);

            var new_entity = new entities.Entity(params);
            result = his_player.add_entity(new_entity);

            if (result) {
                var ent_t_apts = utils.transform_obj_to_name(new_entity, 'aptitudes');
                var response_data = utils.transform_obj_to_name(ent_t_apts, 'vulnerabilities');

            }
            response = {result: result, data: response_data};
        }

        app.io.broadcast('entity:add', response);
    },

    move: function (req) {
        /*
         ,{his_player_id :'rafikplayer',
         name:'rafikentity',
         x:10, y:15}
         */
        var params = req.data;
        var entity_name = params.name;
        var result = false;
        var response = {};
        var his_player_id = params.his_player_id;

        var the_player = _.find(board.players, function (pl) {
            return (pl.name == his_player_id)
        });
        var the_entity = _.find(the_player.entities, function (ent) {
            return ent.name == entity_name
        });
        // the entity belongs to this player
        if (the_entity) {
            result = true;
            the_entity.move_to_coords(params.x, params.y);

        }
        var ent_t_apts = utils.transform_obj_to_name(the_entity, 'aptitudes');
        var response_data = utils.transform_obj_to_name(ent_t_apts, 'vulnerabilities');

        response = {result: result, data: response_data};

        app.io.broadcast('entity:move', response);

    },

    list_aptitudes: function (req) {
        var params = req.data;
        var target_player_id = params.target_player_id;
        var target_entity_id = params.target_entity_id;
        var the_player = _.find(board.players, function (pl) {
            return (pl.name == target_player_id)
        });

        var the_entity = _.find(the_player.entities, function (el) {
            return (el.name == target_entity_id)
        });

        var aptitudes = _.map(the_entity.aptitudes, function (apt) {
            return (apt.name)
        });

        if (aptitudes) {
            response = {
                result: true, target_player_id: target_player_id,
                target_entity_id: target_entity_id,
                aptitudes: aptitudes
            }
        }
        else response = {result: false};
        req.io.emit('entity:list_aptitudes', response);
    },

    list_vulnerabilities: function (req) {
        var params = req.data;
        var target_player_id = params.target_player_id;
        var target_entity_id = params.target_entity_id;
        var the_player = _.find(board.players, function (pl) {
            return (pl.name == target_player_id)
        });
        var the_entity = _.find(the_player.entities, function (el) {
            return (el.name == target_entity_id)
        });
        var vulnerabilities = _.map(the_entity.vulnerabilities, function (vul) {
            return (vul.name)
        });
        if (vulnerabilities) {
            response = {
                result: true,
                target_player_id: target_player_id,
                target_entity_id: target_entity_id,
                vulnerabilities: vulnerabilities
            }
        }
        else response = {result: false};

        req.io.emit('entity:list_vulnerabilities', response);
    },

    buy_aptitude: function (req) {

        params = req.data;
        his_player_id = params.his_player_id;
        his_entity_id = params.his_entity_id;
        aptitude_id = params.aptitude_id;
        // do the entity belong to the player ?
        var result = false;
        var response = {};
        var the_player = _.find(board.players, function (pl) {
            return (pl.name == his_player_id)
        });

        // does it exist ?
        var the_entity = _.find(the_player.entities, function (ent) {
            return ent.name == his_entity_id;
        });

        // yes this is his entity, and it exists
        if (the_entity) {

            // is this aptitude in the game rules ?
            var the_aptitude = rules[aptitude_id];
            if (the_aptitude) {
                the_entity.buy_aptitude(the_aptitude);
                var ent_t_apts = utils.transform_obj_to_name(the_entity, 'aptitudes');
                var response_data = utils.transform_obj_to_name(ent_t_apts, 'vulnerabilities');
                result = true;
                response = response_data;


            }
        }
        app.io.broadcast('entity:buy_aptitude', {result: result, response: response});
    },

    attack: function (req) {
        params = req.data;
        var result = false;
        var response = {};

        source_player_id = params.source_player_id;
        source_entity_id = params.source_entity_id;
        source_aptitude_id = params.source_aptitude_id;

        target_player_id = params.target_player_id;
        target_entity_id = params.target_entity_id;
        target_vulnerability_id = params.target_vulnerability_id;

        // is this a valid player id ?
        source_player = _.find(board.players, function (pl) {
            return pl.name == source_player_id
        });


        // is this a valid entity id ?
        source_entity = _.find(source_player.entities, function (ent) {
            return ent.name == source_entity_id
        });


        // is this a valid aptitude ?
        source_aptitude = _.find(rules.all_aptitudes(), function (apt) {
            return apt.name == source_aptitude_id
        });


        // is this a valid target ?

        target_player = _.find(board.players, function (pl) {
            return pl.name == target_player_id
        });


        // is this a valid target entity ?

        target_entity = _.find(target_player.entities, function (ent) {
            return ent.name == target_entity_id
        });


        // is this a valid target vulnerability ?
        // is this a valid vulnerability ?

        target_vulnerability = _.find(rules.all_vulnerabilities(), function (vul) {
            return vul.name == target_vulnerability_id
        });

        if (source_player && source_entity && source_aptitude &&
            target_player && target_entity && target_vulnerability &&
            source_player_id != target_player_id) {

            var the_attack = source_player.attack(source_entity, source_aptitude,
                target_player, target_entity, target_vulnerability);

            if (the_attack && game.validate_attack(the_attack).valid) {
                utils.add_a_thing(board.attacks, the_attack);
                result = true;
                response = {
                    name: the_attack.name, source_player: the_attack.source_player.name,
                    source_entity: the_attack.source_entity.name, source_aptitude: the_attack.source_aptitude.name,
                    target_player: the_attack.target_player.name,
                    target_entity: the_attack.target_entity.name,
                    target_vulnerability: the_attack.target_vulnerability.name
                }
            }
        }
        app.io.broadcast('entity:attack', {result: result, response: response});

    },

    transact: function (req) {
        params = req.data;
        var result = false;
        var response = {};
        source_player_id = params.source_player_id;
        source_entity_id = params.source_entity_id;
        source_aptitude_id = params.source_aptitude_id;

        target_player_id = params.target_player_id;
        target_entity_id = params.target_entity_id;
        target_aptitude_id = params.target_aptitude_id;

        // is this a valid player id ?
        source_player = _.find(board.players, function (pl) {
            return pl.name == source_player_id
        });


        // is this a valid entity id ?
        source_entity = _.find(source_player.entities, function (ent) {
            return ent.name == source_entity_id
        });


        // is this a valid aptitude ?
        source_aptitude = _.find(rules.all_aptitudes(), function (apt) {
            return apt.name == source_aptitude_id
        });


        // is this a valid target ?

        target_player = _.find(board.players, function (pl) {
            return pl.name == target_player_id
        });


        // is this a valid target entity ?

        target_entity = _.find(target_player.entities, function (ent) {
            return ent.name == target_entity_id
        });


        // is this a valid target vulnerability ?
        // is this a valid vulnerability ?

        target_aptitude = _.find(rules.all_aptitudes(), function (vul) {
            return vul.name == target_aptitude_id
        });

        if (source_player && source_entity &&
            source_aptitude && target_player &&
            target_entity && target_aptitude &&
            source_player_id != target_player_id) {
            var the_transact = source_player.transact(source_entity, source_aptitude_id,
                target_player, target_entity, target_aptitude);
            if (the_transact && game.validate_transact(the_transact).valid) {
                result = true
                utils.add_a_thing(board.transacts, the_transact);
                response = {
                    name: the_transact.name, source_player: source_player_id,
                    source_entity: source_entity_id,
                    source_aptitude: source_aptitude_id,
                    target_player: target_player_id,
                    target_entity: target_entity_id,
                    target_aptitude: target_aptitude_id
                }
            }

        }
        app.io.broadcast('entity:transact', {result: result, response: response});
    },

    defend: function (req) {
        params = req.data;

        attack_id = params.attack_id;
        defense_aptitude_id = params.defense_aptitude_id;

        var result = false;
        var response = {};

        the_attack = _.find(board.attacks, function (att) {
            return (att.name == attack_id)
        });
        the_defense_aptitude = _.find(rules.all_aptitudes(), function (def) {
            return (def.name == defense_aptitude_id)
        });

        if (!the_attack || the_defense_aptitude) return;
        target_player_id = the_attack.source_player.name;
        target_player = _.find(board.players, function (pl) {
            return (pl.name == target_player_id)
        });
        if (target_player && the_attack && the_defense_aptitude) {
            var defense = target_player.defend(the_attack, the_defense_aptitude);
            if (defense && game.validate_defense(defense).valid) {
                result = true;
                utils.add_a_thing(board.defenses, defense);
                response = {name: defense.name, attack: the_attack.name, defense_aptitude: the_defense_aptitude};
            }
        }
        app.io.broadcast('entity:defend', {result: result, response: response});
    }

});

app.io.route('info', {
    aptitudes: function (req) {
        var apts = rules.all_aptitudes();
        req.io.emit('info:aptitudes', {aptitudes: apts})
    }
});

app.io.route('game', {
    start: function (req) {

        setInterval(function () {
            console.log('tick')
            var defended_attacks = _.map(board.defenses, function (def) {
                def.attack
            });
            var non_defended_attacks = _.difference(board.attacks, defended_attacks);

            // defended attacks, I get outcome, apply it to source, dest, and remove defenses and attacks

            _.map(board.defenses, function (def) {
                var source = def.attack.source_entity;
                var target = def.attack.target_entity;
                var outcome = rules.possible_defenses[utils.hash_obj_tuple(def.attack.source_aptitude,
                    def.defense_aptitude)];
                source.webmana += outcome.source;
                target.webmana += outcome.target;
                app.io.broadcast('game:webmana', {
                    source: source.name, source_webmana: source.webmana,
                    target: target.name, target_webmana: target.webmana
                });
            })
            board.defenses = [];

            _.map(defended_attacks, function (att) {
                board.attacks = _.without(board.attacks, att);
                app.io.broadcast('game:attack-finished', att.name);
            })

// non defended attacks, I apply their outcome

            _.map(non_defended_attacks, function (att) {
                var source = att.source_entity;
                var target = att.target_entity;

                var outcome = rules.possible_attacks[utils.hash_obj_tuple(att.source_aptitude,
                    att.target_vulnerability)];

                source.webmana+=outcome.source;
                target.webmana+=outcome.target;
                app.io.broadcast('game:webmana', {
                    source: source.name, source_webmana: source.webmana,
                    target: target.name, target_webmana: target.webmana
                });
            })

        }, 1000)
    }
});


// TO DELETE
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/test-api.html')
})
//TO DELETE

app.listen(8080);

