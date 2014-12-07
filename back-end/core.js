/**
 * Created by rafik-naccache on 06/12/14.
 */
var game = require('game');
var entities = require('entities')
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
        console.log(response);
        req.io.emit('player:register', response)
    }
});

app.io.route('entity', {
    add: function (req) {
        var params = req.data;
        var his_player_id = params.his_player_id;

        var his_player = _.find(board.players, function (pl) {
            return (pl.name == his_player_id);
        })

        console.log('board.players: '+board.players[0].name);

        var result=false;
        var entity_name = params.name

        console.log('hisplayer '+his_player.name);
        if (his_player) {
            var new_entity = new entities.Entity(params);
            result = his_player.add_entity(new_entity);

            if (result) {
                board.remove_a_thing(board.players, his_player);
                board.add_a_thing(board.players, his_player);
            }
        } // needs maybe better handling ?

        response = {result : result, name : entity_name};
        console.log(response);
        req.io.emit('entity:add', response);
    }


})



app.get('/', function (req, res) {
    res.sendfile(__dirname + '/client.html')
})

app.listen(8080);

