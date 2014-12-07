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
var  rules = new game_data.init_data();

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err);
});


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
        var response = {};
        var entity_name = params.name

        var exist_entity = _.some(board.all_entities(),function(ent) {return ent.name == entity_name});

        if (his_player && !exist_entity) {
            params.vulnerabilities = _.sample(rules.all_vulnerabilities(),3);

            var new_entity = new entities.Entity(params);
            result = his_player.add_entity(new_entity);

            if (result) {
                var ent_t_apts = utils.transform_obj_to_name(new_entity, 'aptitudes');
                var response_data = utils.transform_obj_to_name(ent_t_apts, 'vulnerabilities');
                response = {result: result, data: response_data};
                board.remove_a_thing(board.players, his_player);
                board.add_a_thing(board.players, his_player);
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
        var response_data = utils.transform_obj_to_name(ent_t_apts, 'vulnerabilities');

        response = {result: result, data: response_data};

        app.io.broadcast('entity:move', response);
    },

    list_aptitudes: function(req){
        var params = req.data;
        var target_player_id = params.target_player_id;
        var target_entity_id = params.target_entity_id;
        var the_player = _.find(board.players,function(pl){return(pl.name == target_player_id)});
        var the_entity = _.find(the_player.entities,function(el) {return (el.name == target_entity_id)});
        var aptitudes= _.map(the_entity.aptitudes,function(apt) {return (apt.name)});
        if (aptitudes)
        {response = {result:true, target_player_id:target_player_id,
            target_entity_id:target_entity_id,
            aptitudes:aptitudes}}
            else response = {result:false};
        req.io.emit('entity:list_aptitudes',response);
    },

    list_vulnerabilities :function(req){
         var params = req.data;
        var target_player_id = params.target_player_id;
        var target_entity_id = params.target_entity_id;
        var the_player = _.find(board.players,function(pl){return(pl.name == target_player_id)});
        var the_entity = _.find(the_player.entities,function(el) {return (el.name == target_entity_id)});
        var vulnerabilities= _.map(the_entity.vulnerabilities,function(vul) {return (vul.name)});
        if (vulnerabilities)
        {response = {result:true,
            target_player_id:target_player_id,
            target_entity_id:target_entity_id,
            vulnerabilities:vulnerabilities}}
            else response = {result:false};

        req.io.emit('entity:list_vulnerabilities',response);
    },

    buy_aptitude: function (req) {

        params = req.data;
        his_player_id = params.his_player_id;
        his_entity_id = params.his_entity_id;
        aptitude_id = params.aptitude_id;
     // do the entity belong to the player ?
        var result = false;
        var response  = {};
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
    app.io.broadcast('entity:buy_aptitude',{result : result, response : response});
    }

})




app.get('/', function (req, res) {
    res.sendfile(__dirname + '/client.html')
})

app.listen(8080);

