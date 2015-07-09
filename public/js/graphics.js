function Sprite(options) {
    var _this = this;

    //TODO: Spritesheet support
    this.width = options.width;
    this.height = options.height;
    this.path = options.path;
    
    this.ready = false;
    this.readyQueue = [];
    this.image = new Image();
    this.image.src = this.path;

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

    game.ctx.drawImage(this.image, x, y, w, h);
};