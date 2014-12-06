/**
 * Created by ibtissem on 06/12/14.
 */
var params = {
    entities:[],
    player_id:5,
    game_id:1,
    score:100,
    enemy_entities:[]
};
var player = new Player(params);
console.log(player.player_id);
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
player.createEntity(data);
console.log(player.entities);


var setEventHandlers = function() {
    // Socket connection successful
    socket.on("connect", onSocketConnected);
    // Socket disconnection
    socket.on("disconnect", onSocketDisconnect);

    socket.on("new player", player.updateEnemy);

    socket.on("entity ennemies", player.updateEnemyEntities);

    socket.on("move entity", player.updateEnemyEntity);

    socket.on("new entity", player.addNewEnemyEntity);

    socket.on("attack", player.defend);

    socket.on("ended attack", player.endedAttack);
};

// Socket connected
function onSocketConnected() {
    console.log("Connected to socket server");
    // Send local player data to the game server
    socket.emit("new player", player);
};

// Socket disconnected
function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

function onMoveEntity(data) {
};

