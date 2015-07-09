var game = {
        requestAnimationFrame:
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame,
        animation_fps: 60
    },
    player = {
        speed: 5
    };

game.init = function() {
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

    player.x = (game.width / 2) - 16;
    player.y = (game.height / 2) - 16;

    player.sprite = new Sprite({
        width: 32,
        height: 32,
        path: "img/player.png"
    });

    game.mainLoop();
};

game.mainLoop = function() {


    game.ctx.clearRect(0, 0, game.width, game.height);


    // collision debug
    console.log('collision test: ' + debugCollisionManager.AABB({x: player.x, y: player.y, width: player.sprite.width, height: player.sprite.height}, debugRect))
    game.ctx.fillRect(debugRect.x, debugRect.y, debugRect.width, debugRect.height);
    // ---
    
    player.sprite.draw(player.x, player.y);

    if(heldkeys[KEYS.RIGHT]) {
        player.x += player.speed;
    }

    if(heldkeys[KEYS.LEFT]) {
        player.x -= player.speed;
    }

    if(heldkeys[KEYS.DOWN]) {
        player.y += player.speed;
    }

    if(heldkeys[KEYS.UP]) {
        player.y -= player.speed;
    }

    //Execute next iteration
    if(game.requestAnimationFrame) {
        game.requestAnimationFrame(game.mainLoop);
    } else {
        setTimeout(game.mainLoop, 1000 / animation_fps);
    }
};