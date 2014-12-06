/**
 * Created by ibtissem on 06/12/14.
 */
var Player = function(parameters) {
    this.game_id = parameters.game_id;
    this.player_id = parameters.player_id;
    this.enemy = parameters.enemy;
    this.entities = parameters.entities;
    this.score = parameters.score;
    this.enemy_entities = parameters.enemy_entities;
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

Player.prototype.addNewEnemyEntity = function(entity){
    this.enemy_entities.push(entity);
}

Player.prototype.updateEnemyEntity = function(entity){
    for(var i in this.enemy_entities){
        if(this.enemy_entities[i].name == entity.name){
            this.enemy_entities[i] = entity;
            /**
             * TODO move enemy entity on map
             */
        }
    }
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

Player.prototype.updateEnemy = function(enemy){
    this.enemy = enemy;
}

Player.prototype.defend = function(data){
    /**
     * TODO
     */
}
Player.prototype.endedAttack = function(data){
    /**
     * TODO
     */
}

Player.prototype.search = function(){
    /**
     * TODO
     */
}