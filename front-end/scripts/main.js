/**
 * Created by ibtissem on 06/12/14.
 */

require.config({
    paths: {
        entities: '/back-end/entities',
        players: '/back-end/players'
    }
});

require(['entities', 'players'], function(entities,players) {
    var data = {
        name: 'Master',
        x:0,
        y:0,
        is_serverp:true,
        is_goodp:true,
        aptitudes:[],
        vulnerabilities:[],
        webmana:20,
        his_player_id:10
    };
    var entity = new entities.Entity(data);
    console.log("Old values: ", entity.x, entity.y);
    entity.move(20, 30);
    console.log("New values: ", entity.x, entity.y);
});
