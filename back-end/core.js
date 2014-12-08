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
        var player = new players.Player(params);
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
                response = {result: result, data: response_data};
            }
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
            source_player_id != target_player_id

        ) {
            var the_attack = source_player.attack(source_entity, source_aptitude,
                target_player, target_entity, target_vulnerability);

            if (game.validate_attack(the_attack).valid) {
                utils.add_a_thing(board.attacks, the_attack);
                result = true;
                response = {
                    name: the_attack.name, source_player: the_attack.source_player.name,
                    source_entity: the_attack.source_entity.name, source_aptitude: the_attack.source_aptitude.name,
                    target_player: the_attack.target_player.name,
                    target_entity: the_attack.target_entity.name,
                    target_vulnerability:the_attack.target_vulnerability.name
            }
        }
    }
    app.io.broadcast('entity:attack', {result: result, response: response});

}


})
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/test-api.html')
})


app.listen(8080);

