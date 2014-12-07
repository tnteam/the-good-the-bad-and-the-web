/**
 * Created by rafik-naccache on 06/12/14.
 */
var game = require('game');
var entities = require('entities')
var players = require('players');
var _ = require('underscore');
var utils = require('utils');

var app = require('express.io')();
var board = new game.Board();

app.http().io();

app.io.route('player', {
    register: function (req) {
        var params = req.data;
        var player = new players.Player(params);
        var result = board.add_a_thing(board.players, player);
        var response = {result: result, data: utils.transform_obj_to_name(player,'entities')};

        app.io.broadcast('player:register', response)
    }
});

app.io.route('entity', {
    add: function (req) {
        var params = req.data;
        var his_player_id = params.his_player_id;

        var his_player = _.find(board.players, function (pl) {
            return (pl.name == his_player_id);
        })

          var result = false;
        var entity_name = params.name


        if (his_player) {
            var new_entity = new entities.Entity(params);
            result = his_player.add_entity(new_entity);

            if (result) {
                board.remove_a_thing(board.players, his_player);
                board.add_a_thing(board.players, his_player);
            }
        } // needs maybe better handling ?

        var ent_t_apts = utils.transform_obj_to_name(new_entity, 'aptitudes');
        var response_data = utils.transform_obj_to_name(ent_t_apts, 'aptitudes');

        response = {result: result, data: response_data};

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
        var response;
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
            the_entity.move(params.x, params.y);
            board.remove_a_thing(the_player.entities, the_entity);
            board.add_a_thing(the_player.entities, the_entity);
        }
        var ent_t_apts = utils.transform_obj_to_name(the_entity, 'aptitudes');
        var response_data = utils.transform_obj_to_name(ent_t_apts, 'aptitudes');

        response = {result: result, data: response_data};

        app.io.broadcast('entity:move', response);
    }

})


app.get('/', function (req, res) {
    res.sendfile(__dirname + '/client.html')
})

app.listen(8080);

