/**
 * Created by ibtissem on 06/12/14.
 */
var Player = function(parameters) {
    var game_id = parameters.game_id;
    var player_id = parameters.player_id;
    var entities = parameters.entities;
    var score = parameters.score;
    var enemy_entities = parameters.enemy_entities;
}

Player.prototype.createEntity = function(entity) {
    this.entities.push(entity);
}

Player.prototype.removeEntity = function(entity) {
    this.entities.splice(this.entities.indexOf(entity), 1);
}

Player.prototype.updateEnemyEntities = function(enemy_entities) {
    this.enemy_entities = enemy_entities;
}

Player.prototype.removeEntity = function(entity) {
    this.entities.splice(this.entities.indexOf(entity), 1);
}

Player.prototype.addToScrore = function(amount){
    this.score = this.score + amount;
}

Player.prototype.SetScrore = function(newScore){
    this.score = newScore;
}
