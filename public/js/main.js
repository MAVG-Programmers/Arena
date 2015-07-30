console.log("Main initialized.");

var CONSTANTS = {}, //Sent by server
    game = {
        requestAnimationFrame:
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame,
        animation_fps: 60,
        initialized: false,
        PADDING: 40
    },
    yourself = {};

game.init = function() {
    game.initialized = true;
    audio.init();

    //Initialize canvas
    game.canvas = $("#canvas");
    game.ctx = game.canvas[0].getContext("2d");
    game.width = game.canvas.width();
    game.height = game.canvas.height();

    //requestAnimationFrame will break if it is called in a context other than window, so it needs to be bound to the window object
    if(game.requestAnimationFrame) {
        game.requestAnimationFrame = game.requestAnimationFrame.bind(window);
    }

    //TODO: Don't hardcode this
    decodeAndGenerate("1.0.0/Test map/Hydrothermal/1 14|1;0 12;1|1;0 12;1|1 4;0 6;1 4|1;0 12;1|1;0 12;1|1;0 12;1|1;0 3;1 6;0 3;1|1;0 12;1|1;0 12;1|1 14");
    game.mainLoop();
};

game.mainLoop = function() {
    game.ctx.clearRect(0, 0, game.width, game.height);

    var move = 0;

    if(heldkeys[KEYS.RIGHT]) {
        move = 1
    }

    if(heldkeys[KEYS.LEFT]) {
        move = -1;
    }

    Player.players[yourself.id].speed.x = move*CONSTANTS.PLAYER.SPEED;

    if(Player.players[yourself.id].inAir){
        Player.players[yourself.id].speed.y += CONSTANTS.GRAVITY;
    }

    // Temporary player object with applied x movement
    var temp_x = {
        x: Player.players[yourself.id].x + Player.players[yourself.id].speed.x,
        y: Player.players[yourself.id].y,
        width: Player.players[yourself.id].width,
        height: Player.players[yourself.id].height,
    };

    // Temporary player object with applied y movement
    var temp_y = {
        x: Player.players[yourself.id].x,
        y: Player.players[yourself.id].y + Player.players[yourself.id].speed.y,
        width: Player.players[yourself.id].width,
        height: Player.players[yourself.id].height,
    };

    // If colliding in the x direction
    if(Platform.isObjectCollidingWithAPlatform(temp_x) || !collisionManager.isInsideBounds(temp_x).x) {
        move = 0;
        Player.players[yourself.id].speed.x = 0;
    }

    // If colliding in the y direction and being in air
    if((Platform.isObjectCollidingWithAPlatform(temp_y) || !collisionManager.isInsideBounds(temp_y).y) && Player.players[yourself.id].inAir) {
        Player.players[yourself.id].inAir = false;
        Player.players[yourself.id].speed.y = 0;
        socket.emit('on ground');
    }

    // Else if the player has left the platform he was standing on
    else if(
        !Platform.isObjectCollidingWithAPlatform({
            x: temp_y.x,
            y: temp_y.y+10,
            width: temp_y.width,
            height: temp_y.height
        }) &&
        !Player.players[yourself.id].inAir
    ) {
        Player.players[yourself.id].inAir = true;
        socket.emit('in air')
    }

    // If the player is on the ground and pressing the jump button
    if(!Player.players[yourself.id].inAir && heldkeys[KEYS.SPACE]) {
        Player.players[yourself.id].inAir = true;
        Player.players[yourself.id].speed.y = CONSTANTS.PLAYER.JUMP;
        socket.emit('jump')
    }

    // Transmitting x-direction movement to the server
    socket.emit('move', move);

    // Doing a local prediction update which will be overridden by the server later
    Player.players[yourself.id].x += Player.players[yourself.id].speed.x;
    Player.players[yourself.id].y += Player.players[yourself.id].speed.y;

    Bullet.updateBullets();

    //Drawing objects
    Bullet.drawBullets();
    Player.drawPlayers();
    Platform.drawPlatforms();

    //Execute next iteration
    if(game.requestAnimationFrame) {
        game.requestAnimationFrame(game.mainLoop);
    } else {
        setTimeout(game.mainLoop, 1000 / animation_fps);
    }
};