//TODO: 2d spritesheet support
//TODO: Non-looping sprites (unnecessary?)
function Sprite(options) {
    var _this = this;

    this.animated = options.animated;
    this.width = options.width;
    this.height = options.height;
    this.path = options.path;
    
    this.ready = false;
    this.readyQueue = [];
    this.image = new Image();
    this.image.src = this.path;

    if(this.animated) {
        this.sheetwidth = options.sheetwidth;
        this.speed = options.speed || 1;

        this.frames = this.sheetwidth / this.width;
        this.frame = 0;

        if(this.frames % 1 != 0) {
            console.trace("%cWarning: Sprite's frame count is not a whole number (" + this.sheetwidth + " / " + this.width + " \u2248 " + this.frames + ")", "color: #e41;");
        }
    }

    this.image.onload = function() {
        _this.ready = true;

        for(var i = 0; i < _this.readyQueue.length; i++) {
            _this.readyQueue[i]();
        }
    };
}

Sprite.prototype.onReady = function(fn) {
    if(this.ready) {
        fn();
    } else {
        this.readyQueue.push(fn);
    }
};

Sprite.prototype.draw = function(x, y, w, h) {
    if(!this.ready) { return; }

    //Default the width and height to the image's width and height
    w = w || this.width;
    h = h || this.height;

    if(!this.animated) {
        game.ctx.drawImage(this.image, x, y, w, h);
    } else {
        //The second and third arguments here are the x and y coordinates of where in the source image to capture the sprite from
        //Multiplying the frame index by the width of each frame gives the x-coordinate of each frame's start
        //The frame needs to be floored because the sprite speed will often be set to increment the frame index in decimals
        //The next two arguments are how far to the right and bottom to capture from the source image (i.e. the frame size)
        game.ctx.drawImage(this.image, Math.floor(this.frame) * this.width, 0, this.width, this.height, x, y, w, h);

        //This increments the frame index by the sprite's animation speed, and wraps it around the frame count to provide looping
        this.frame = (this.frame + this.speed) % this.frames;
    }
};