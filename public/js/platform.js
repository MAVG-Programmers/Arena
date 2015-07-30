console.log("platform init");

function Platform(options) {
    if(options) {
        this.spawn(options);
    }
}

Platform.WIDTH = 32;
Platform.HEIGHT = 32;
Platform.platforms = [];

//from and to are objects with the following properties required: x, y
Platform.prototype.spawn = function(platform) {
    platform.x += game.PADDING;
    platform.y += game.PADDING;

    this.x = platform.x;
    this.y = platform.y;
    this.width = platform.width;
    this.height = platform.height;
    this.angle = platform.angle;

    Platform.platforms.push(this);
};

Platform.prototype.update = function(platform) {
    this.x = platform.x;
    this.y = platform.y;
    this.angle = platform.angle;
};

Platform.prototype.draw = function(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
};

Platform.drawPlatforms = function() {
    for(var i = 0; i < Platform.platforms.length; i++) {
        var platform = Platform.platforms[i];
        platform.draw(game.ctx);
    }
};

Platform.isObjectCollidingWithAPlatform = function(object) {
    var platform,
        colliding = false;

    for(var i = 0; i < Platform.platforms.length; i++) {
        platform = Platform.platforms[i];
        platform.draw(game.ctx);

        if(collisionManager.AABB(object, platform)) {
            colliding = true;
            break;
        }
    }

    return colliding;
};