console.log('player init')


function Player()
{
	this.spawn = function (player) // from and to are position objects with the following properties required: x, y
	{
		for (var key in player)
		{
			this[key] = player[key];
		}

		this.width = Player.width;
		this.height = Player.height;

		Player.players[player.id] = this;
	};

	this.update = function (player)
	{
		this.x = player.x;
		this.y = player.y;
	}

	this.draw = function (ctx)
	{
		Player.sprite.draw(this.x, this.y);
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

Player.width = 32,
Player.height = 32,
Player.sprite = new Sprite({
        width: Player.width,
        height: Player.height,
        path: "img/player.png"
    });
