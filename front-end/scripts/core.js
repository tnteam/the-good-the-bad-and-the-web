/**
 * Created by ibtissem on 07/12/14.
 */

var buy_item, buy_apt, io;
window.onload = function() {
    var game = new Phaser.Game(1100, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render:render });
    var gameEntities = {}, attackLine, defendLine;
    var text, player_id, player_credit = 20, credit, menu ;
    var button_play;
    var button_about;
    var button_options;
    var map;
    var logo;
    var group_nuages;
    var account = 100;
    var selectedApitude = 'ssl';
    var buttons = [];
    var aptitudes = {
        ssl_crypt:'SSL crypt',
        ssl_decrypt:'SSL decrypt',
        buy_stuff:'Buy stuff',
        sell_stuff:'Sell stuff',
        get_information:'Get information',
        give_information:'Give information',
        track_user:'Track user',
        steal_user_photos:'Steal user photos',
        user_read_fine_prints:'Read fine prints',
        steal_user_password:'Steal user password',
        steal_sensitive_data:'Steal sensitive data',
        user_using_weak_passwords:'Using weak passwords', 
        user_use_non_tracing_services:'Using non tracing services', 
        user_updates_patches:'Use update patches',
        user_not_crypting_emails: 'Using no crypting emails',
        user_use_two_factor_auth:'Using two auth factors',
        user_using_gpg:'Using gpg',
        user_not_doing_update:'Not doing updates',
        user_non_rights_aware:'Being not aware of rights'
    };
    var lineDefend, lineAttak;
    function preload() {
        text = game.add.text(32, 32, 'loading', { fill: '#ffffff' });// le texte initiale
        game.load.onLoadStart.add(loadStart, this);//qd le load commece
        game.load.onFileComplete.add(fileComplete, this);//pendant le load
        game.load.onLoadComplete.add(loadComplete, this);   //en fin de load
        //chargement ds fichier
        game.load.image('button_play', './front-end/assets/play.png');
        game.load.image('button_about', './front-end/assets/about.png');
        game.load.image('button_options', './front-end/assets/options.png');
        game.load.image('map', './front-end/assets/circuit-imprime_20.png');
        game.load.image('nuage1', './front-end/assets/nuage1.png');
        game.load.image('nuage2', './front-end/assets/nuage2.png');
        game.load.image('nuage3', './front-end/assets/nuage3.png');
        game.load.atlasJSONHash('player', './front-end/assets/sprite_perso.png', './front-end/assets/sprite_perso.json');
        game.load.atlasJSONHash('player3', './front-end/assets/sprite_perso2.png', './front-end/assets/sprite_perso2.json');
        game.load.atlasJSONHash('player2', './front-end/assets/sprite_run.png', './front-end/assets/sprite_run.json');
        game.load.image('logo', './front-end/assets/logo.png');
        game.load.audio('music', ['./front-end/assets/narutu.mp3', './front-end/assets/bodenstaendig_2000_in_rock_4bit.ogg']);
        game.load.image('aptitude','./front-end/assets/4.png');
        game.load.image('vul','./front-end/assets/danger.png');
        game.load.image('serveur01', './front-end/assets/serveur01.png');
        game.load.image('serveur02', './front-end/assets/serveur02.png');
        //game.load.spritesheet('player','player.png');
    }


    //qd le load commece
    function loadStart() {

        text.setText("Loading ...");

    }

    //  a chaque fois qu'un ficheier termine son telechargement on affiche le pourcentage terminé
    function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
        text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
    }
    //qd on finit le loading
    function loadComplete(game) {
        //pour enlever le texte de l'cran apres chargement
        text.destroy();
        // game.world.remove(text);
    }

    function create () {
        io = io.connect();
        io.emit('player:register',{
                name: Math.random().toString(36).substr(2, 5),
                entities:[],
                game_id: "game1",
                webmana: 20
              });
        setIoHandlers(io);
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //redimentionnement de la carte du jeu
        game.world.setBounds(0, 0, 10050, 6000);
        //chargent de la texture de la map
        land = game.add.tileSprite(0, 0, 10000, 6000, 'map');
        //le logo qui tourne ;) logo.kill(); tue le logo pour le faire disparitre de l'ecran
        credit = game.add.text(10, 5, "Your webmana is: " + player_credit.toString(), {font: "16px Arial", fill: "#000"});
        logo = game.add.sprite(950, 450, 'logo');
        //le centre de la rotaion
        logo.anchor.setTo(0.5, 0.5);
        //redimentionnement 30%
        logo.scale.x = 0.3;
        logo.scale.y = 0.3;
        music = game.add.audio('music');
        music.play();
        group_nuages = game.add.group();
        cursors = game.input.keyboard.createCursorKeys();
        //  Scaled buttons
        //buttons = createMenu(20, 20);

    }
    var setIoHandlers = function(io){
        // result : event : entity:add, {result : true, name ; rafikentity}
        io.on('player:register',function(data){
            if(data.result == true && data.data){
                player_id = data.data.name;
                player_credit = data.data.webmana;
            }
        });

        io.on('entity:add',function(data) {
            if(data.result  && data.data != {})
                createEntity(data.data);
        });

        io.on('entity:move', function(data) {
            moveEntity(data);
        });

        io.on('entity:list_aptitudes',function(data){
            gameEntities[data.entity].aptitudes = data.aptitudes;
        });

        io.on('entity:list_aptitudes',function(data){
            gameEntities[data.entity].aptitudes = data.aptitudes;
        });

        io.on('entity:list_vulnerabilities',function(data){
            gameEntities[data.entity].aptitudes = data.vulnerabilities;
        });

        io.on('entity:attack', function(data) {
            createAttack(data);
        });

        io.on('player:webmana_modif', function(data) {
            updatePlayerSore(data);
        });

        io.on('info:aptitudes', function(data) {
            console.log("info:aptitudes"+JSON.stringify(data));
        });

    }
    function createMenu(ptX,ptY){
        var i = 0;
        var menu = [];
        for (var x in aptitudes) {
            var duck = game.add.group();

            duck.x = ptX;
            duck.y = ptY+(40*i);
            i++;
            var d = game.add.button(0,0, 'aptitude', changeAptitude,duck);
            d.scale.setTo(0.3, 0.3);
            //d.anchor.setTo(0.5, 0.5);
            d.name = aptitudes[x];
            var t = game.add.text(40,2,aptitudes[x]);

            duck.add(d);
            duck.add(t);
            duck.backgroundColor = "#000";
            menu.push(duck);
        }
        return menu;
    }
    function changeAptitude(button){
        //alert(button.name);
    }
    function button_play_fct () {
    }

    function update(){
        logo.angle += 1;

        //game.physics.arcade.collide(player, player2);
        if (cursors.up.isDown)
        {
            game.camera.y -= 4;
        }
        else if (cursors.down.isDown)
        {
            game.camera.y += 4;
        }

        if (cursors.left.isDown)
        {
            game.camera.x -= 4;
        }
        else if (cursors.right.isDown)
        {
            game.camera.x += 4;
        }
    }

    buy_item = function(is_client, is_bad, family){
        if(account > 5){
            // Buy item
            io.emit('entity:add',{name:Math.random().toString(36).substr(2, 5) ,
                x:game.input.mousePointer.x,
                y:game.input.mousePointer.y,
                is_serverp : !is_client,
                is_goodp : !is_bad,
                aptitudes :[],
                vulnerabilities:[],
                webmana:5,
                his_player_id:player_id
            });
        }
        else alert("Insufficient webmana !");
    }

    buy_apt = function(selected_entity_id, aptitude_id){
        // Buy aptitude
        io.emit('entity:buy_aptitude',
            {his_player_id:player_id,
                his_entity_id:selected_entity_id,
                aptitude_id:aptitude_id});

    }

    function createEntity(entity){
        var family;
        if(entity.is_goodp == true && entity.is_serverp == true)
            family = 'serveur01';
        else if(entity.is_goodp == false && entity.is_serverp == true)
            family = 'serveur02';
        else if(entity.is_goodp == false && entity.is_serverp == false)
            family = 'player3';
        else
            family = 'player';
        var sprite = game.add.sprite(entity.x, entity.y, family);
        sprite.inputEnabled = true;
        if(entity.his_player_id == player_id){
            sprite.events.onInputDown.add(displayMenu, this);
        }
        if(entity.is_serverp == true)
            sprite.scale.setTo(0.1, 0.1);

        sprite.anchor.set(0.5);
        if(family=='player3'){
            sprite.animations.add('angry');
            sprite.animations.play('angry', 6, true);
        }

        if(family=='player'){
            //sprite.anchor.set(0.5);
            sprite.animations.add('fly');
            sprite.animations.play('fly', 6, true);
        }

        if(entity.is_serverp == true)
            var text = game.add.text(50, -10, entity.webmana.toString(), {font: "16px Arial", fill: "#000"});
        else
            var text = game.add.text(25, -10, entity.webmana.toString(), {font: "16px Arial", fill: "#000"});

        sprite.addChild(text);
        sprite.name = entity.name;
        if(entity.his_player_id == player_id){
            sprite.inputEnabled = true;
            sprite.input.enableDrag();
            sprite.events.onDragStart.add(startDrag, this);
            sprite.events.onDragStop.add(stopDrag, this);
        }
        gameEntities[entity.name] = {sprite:sprite, entity:entity, text:text, attacks:[], defends: []};
        updatePlayerScore(entity);
    }

    function startDrag(sprite, pointer){

    }

    function stopDrag(sprite, pointer){
        //sprite.name + " dropped at x:" + pointer.x + " y: " + pointer.y
        io.emit('entity:move',{his_player_id :player_id,
            name:sprite.name,
            x:pointer.x, y:pointer.y});
    }

    function createAttack(data){
        if(gameEntities[data.source] && gameEntities[data.target]){
            //Establish attack line
            attackLine = new Phaser.Line(gameEntities[data.source].sprite.x, gameEntities[data.source].sprite.y,
                gameEntities[data.target].sprite.x, gameEntities[data.target].sprite.y);
            //attackLine.fromSprite(gameEntities[data.source].sprite, gameEntities[data.target].sprite, false);
            gameEntities[data.source].attacks.push(attackLine);
        }
    }

    function displayMenu(sprite, pointer){
        attackLine = new Phaser.Line(sprite.x, sprite.y, sprite.x +50, sprite.y+50);
        var i = 0, apt;
         menu = [];
        for (var x in gameEntities[sprite.name].entity.aptitudes) {
            var duck = game.add.group();
            duck.x = sprite.x + 50;
            duck.y = sprite.y+(20*i);
            i++;
            apt = gameEntities[sprite.name].entity.aptitudes[x];
            var d = game.add.button(0,0, 'aptitude', changeAptitude,duck);
            d.scale.setTo(0.3, 0.3);
            //d.anchor.setTo(0.5, 0.5);
            d.name = aptitudes[apt];
            var t = game.add.text(10, 2, aptitudes[apt],{font: "12px Arial", fill: "#000"});
            duck.add(d);
            duck.add(t);
            menu.push(duck);
        }

        for (var x in gameEntities[sprite.name].entity.vulnerabilities) {
            var duck = game.add.group();
            duck.x = sprite.x + 50;
            duck.y = sprite.y+(20*i);
            i++;
            apt = gameEntities[sprite.name].entity.vulnerabilities[x];
            var d = game.add.button(0,0, 'vul', changeAptitude,duck);
            d.scale.setTo(0.3, 0.3);
            //d.anchor.setTo(0.5, 0.5);
            d.name = gameEntities[sprite.name].entity.vulnerabilities[x];
            var t = game.add.text(10, 2,aptitudes[apt], {font: "12px Arial", fill: "#000"});
            duck.add(d);
            duck.add(t);
            menu.push(duck);
        }
        game.input.onDown.add(unpause, self);
        return menu;
    }

    function unpause(){
        for(var i in menu){
            menu[i].destroy();
        }
    }

    function requestNewAttack(sprite, pointer) {

    }

    function moveEntity(entity){
        if (gameEntities[entity.name]){
            gameEntities[entity.name].sprite.x = entity.x;
            gameEntities[entity.name].sprite.y = entity.y;
        }
    }

    function removeEntity(entity){
        if (gameEntities[entity.name]){
            gameEntities[entity.name].sprite.destroy(true);
            delete gameEntities[entity.name];
        }
    }

    function updateEntityScore(data){
        if (gameEntities[data.entity]){
            var oldEntity = gameEntities[data.entity];
            oldEntity.text.setText(""+(oldEntity.entity.webmana + data.webmana));
            /**
             * TODO
             */
            if(data.webmana > 0){
                //animation green
            }
            else {
                //animation red
            }
        }
    }

    function updatePlayerScore(data){
        //{player_id:"rafikplayer",webmana_modif:-5}
        if(data.his_player_id == player_id){
            player_credit = player_credit - data.webmana;
            credit.setText("Your webmana is: "+ player_credit);
        }

    }

    function changeVolume(pointer) {
        if (pointer.y < 300)
        {
            music.volume += 0.1;
        }
        else
        {
            music.volume -= 0.1;
        }
    }
    function render(){
        //game.debug.geom(attackLine);
        //game.debug.rectangle(attackLine);
    }
};
