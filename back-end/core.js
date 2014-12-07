/**
 * Created by rafik-naccache on 06/12/14.
 */
var game = require('game');
var players = require('players');
var _ = require('underscore');

var app = require('express.io')();
var board = new game.Board();

app.http().io();

app.io.route('player', {
    register: function (req) {
        var params = req.data;
        var player = new players.Player(params);
        var result = board.add_a_thing(board.players, player);
        var response = {result: result, name: player.name};
        req.io.emit('players:register:result', response)
    }
});

app.io.route('entity', {
    add: function (req) {
        var params = req.data;
        var his_player_id = params.his_player_id;
        var his_player = _.find(board.players, function (pl) {
            pl.name == his_player_id
        })
        if (his_player) {
            var new_entity = new entities.Entity(params);
            result = his_player.add_entity(new_entity);

            if (result) {
                board.remove_a_thing(board.players, his_player);
                board.add_a_thing(board.players, his_player);
            }
            response = {result: result, name: entity.name}
            req.io.emit('entity:add:result', response)
        }
    }
})



app.get('/', function (req, res) {
    res.sendfile(__dirname + '/client.html')
})

app.listen(8080);

