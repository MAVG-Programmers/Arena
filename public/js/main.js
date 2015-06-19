var game = {
    requestAnimationFrame:
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame,
    animation_fps: 60
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

    game.mainLoop();
};

game.mainLoop = function() {
    game.ctx.clearRect(0, 0, game.width, game.height);

    if(game.requestAnimationFrame) {
        game.requestAnimationFrame(game.mainLoop);
    } else {
        setTimeout(game.mainLoop, 1000 / animation_fps);
    }
};