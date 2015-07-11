console.log("Bullets initialized.");

//Bullet debugging

addEventListener("mousedown", function() {
    var bullet = new Bullet();
    bullet.fire(Player.players[yourself.id], mouse);
}, false);

//---

function Bullet() {
    
}

Bullet.bullets = [];

//from and to are objects with the following properties required: x, y
Bullet.prototype.fire = function(from, to) {
    var angle = Math.atan2(to.y - from.y, to.x - from.x);

    this.x = from.x;
    this.y = from.y;
    
    this.direction = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    };

    Bullet.bullets.push(this);
};

Bullet.prototype.update = function() {
    this.x += this.direction.x * CONSTANTS.BULLET.SPEED;
    this.y += this.direction.y * CONSTANTS.BULLET.SPEED;
}

Bullet.prototype.draw = function(ctx) {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
};

Bullet.updateBullets = function() {
    for(var i = 0; i < Bullet.bullets.length; i++) {
        Bullet.bullets[i].update();
    }
};

Bullet.drawBullets = function() {
    for(var i = 0; i < Bullet.bullets.length; i++) {
        Bullet.bullets[i].draw(game.ctx);
    }
};
