console.log("Main initialized.");

var GAME = {}, //Sent by server
    game = {
        requestAnimationFrame:
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame,
        animation_fps: 60,
        initialized: false
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

    game.mainLoop();
};

game.mainLoop = function() {
    var move = {
        x: 0,
        y: 0
    };

    game.ctx.clearRect(0, 0, game.width, game.height);

    if(heldkeys[KEYS.RIGHT]) {
        move.x = GAME.PLAYER.SPEED;
    }

    if(heldkeys[KEYS.LEFT]) {
        move.x = -GAME.PLAYER.SPEED;
    }

    if(heldkeys[KEYS.DOWN]) {
        move.y = GAME.PLAYER.SPEED;
    }

    if(heldkeys[KEYS.UP]) {
        move.y = -GAME.PLAYER.SPEED;
    }

    // If the player is trying to move himself
    if(move.x != 0 || move.y != 0) {
        // Temporary player object with applied x movement
        var temp_x = {
            x: Player.players[yourself.id].x + move.x,
            y: Player.players[yourself.id].y,
            width: Player.players[yourself.id].width,
            height: Player.players[yourself.id].height,
        };

        // Temporary player object with applied y movement
        var temp_y = {
            x: Player.players[yourself.id].x,
            y: Player.players[yourself.id].y + move.y,
            width: Player.players[yourself.id].width,
            height: Player.players[yourself.id].height,
        };

        // Testing if applied x-movement is legal
        if(Platform.isObjectCollidingWithAPlatform(temp_x) || !collisionManager.isInsideBounds(temp_x).x) {
            move.x = 0;
        }

        // Testing if applied y-movement is legal
        if(Platform.isObjectCollidingWithAPlatform(temp_y) || !collisionManager.isInsideBounds(temp_y).y) {
            move.y = 0;
        }

        // If the movement was accepted in any direction, do move
        if(move.x != 0 || move.y != 0) {
            var your_player = Player.players[yourself.id];
            your_player.x += move.x;
            your_player.y += move.y;
            var angle = Math.atan2(move.y, move.x);

            // Transmits movement angle to server
            socket.emit("move", angle); 
        }
    }

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