console.log('Player init')


function Player()
{
	this.spawn = function (player) // from and to are position objects with the following properties required: x, y
	{
		this.x = player.x;
		this.y = player.y;
		this.id = player.id;

		Player.players[player.id] = this;
	};

	this.update = function (player)
	{
		this.x = player.x;
		this.y = player.y;
	}

	this.draw = function (ctx)
	{
		ctx.fillStyle = 'green'
		ctx.beginPath();
		ctx.arc(this.x, this.y, 7, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.closePath();
	};
}
Player.players = {};

Player.drawPlayers = function()
{
	for (var key in Player.players)
	{
		var player = Player.players[key];
		player.draw(game.ctx);
	}
}
