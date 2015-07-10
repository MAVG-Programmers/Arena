console.log("platform init");

function Platform() {

}

Platform.platforms = [];

//from and to are objects with the following properties required: x, y
Platform.prototype.spawn = function(platform) {
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
}

Platform.prototype.draw = function(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
};

Platform.drawPlatforms = function() {
    for (var i = 0; i < Platform.platforms.length; i++)
    {
        var platform = Platform.platforms[i];
        platform.draw(game.ctx);
    }
}
Platform.isObjectCollidingWithAPlatform = function(object) {
    var colliding = false;

    for(var i = 0; i < Platform.platforms.length; i++) {
        var platform = Platform.platforms[i];
        platform.draw(game.ctx);

        if(collisionManager.AABB(object, platform)) {
            colliding = true;
            break;
        }
    }

    return colliding;
}

//Debug platforms
var p1 = new Platform();
p1.spawn({
    x: 40,
    y: 60,
    width: 300,
    height: 20
});

var p2 = new Platform();
p2.spawn({
    x: 60,
    y: 300,
    width: 100,
    height: 20
});

var p3 = new Platform();
p3.spawn({
    x: 500,
    y: 250,
    width: 300,
    height: 20
});