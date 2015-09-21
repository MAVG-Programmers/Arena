console.log("player init")

function Player() {
    // from and to are position objects with the following properties required: x, y
    this.spawn = function (player) {
        for(var key in player) {
            this[key] = player[key];
        }

        this.width = Player.width;
        this.height = Player.height;
		this.curCoolDown = 0;

        Player.players[player.id] = this;
    };

    this.update = function (player) {
        this.x = player.x;
        this.y = player.y;
		if(this.curCoolDown > 0) {
			this.curCoolDown -= 1;
		}
    };

    this.draw = function (ctx) {
        Player.sprite.draw(this.x, this.y);
    };
}

Player.players = {};

Player.drawPlayers = function() {
    for(var key in Player.players) {
        var player = Player.players[key];
        player.draw(game.ctx);
    }
};

Player.width = 32;
Player.height = 32;
Player.sprite = new Sprite({
    animated: true,
    sheetwidth: 384,
    speed: 0.25,
    width: Player.width,
    height: Player.height,
    path: "img/player.png"
});