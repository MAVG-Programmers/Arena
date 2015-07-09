console.log('bullet init')
console.log(Bullet);

// bullet debugging

addEventListener("mousedown", function()
	{
		var bullet = new Bullet();
		bullet.fire(player, mouse);
	}, false);

// ---

function Bullet()
{
	this.fire = function (from, to) // from and to are position objects with the following properties required: x, y
	{
		this.x = from.x;
		this.y = from.y;

		var angle = Math.atan2(to.y-from.y, to.x-from.x);
		this.speed = {x: Math.cos(angle)*Bullet.speed, y: Math.sin(angle)*Bullet.speed};

		Bullet.bullets.push(this);
	};

	this.update = function ()
	{
		this.x += this.speed.x;
		this.y += this.speed.y;
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
Bullet.speed = 1;
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
