console.log('bullet init')

// bullet debugging

addEventListener("mousedown", function()
	{
		var bullet = new Bullet();
		bullet.fire(Player.players[yourself.id], mouse);
	}, false);

// ---

function Bullet()
{
	this.fire = function (from, to) // from and to are position objects with the following properties required: x, y
	{
		this.x = from.x;
		this.y = from.y;

		var angle = Math.atan2(to.y-from.y, to.x-from.x);
		this.direction = {x: Math.cos(angle), y: Math.sin(angle)};

		Bullet.bullets.push(this);
	};

	this.update = function ()
	{
		this.x += this.direction.x*GAME.BULLET.SPEED;
		this.y += this.direction.y*GAME.BULLET.SPEED;
	}

	this.draw = function (ctx)
	{
		ctx.fillStyle = 'blue'
		ctx.beginPath();
		ctx.arc(this.x, this.y, 4, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.closePath();
	};
}
Bullet.bullets = [];

Bullet.updateBullets = function()
{
	for (var i = 0; i < Bullet.bullets.length; i++)
	{
		var bullet = Bullet.bullets[i];
		bullet.update();
	}
}

Bullet.drawBullets = function()
{
	for (var i = 0; i < Bullet.bullets.length; i++)
	{
		var bullet = Bullet.bullets[i];
		bullet.draw(game.ctx);
	}
}
