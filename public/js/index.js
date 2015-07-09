var socket = io();

socket.emit("join");
socket.on("player update", function(yourself) 
{
    $("#player-id").html("#" + yourself.index + " (" + yourself.id + ")");
    player.x = yourself.x;
    player.y = yourself.y;
});

socket.on("other players", function(players) 
{
	console.log('received other players', players);
  	for (var i = 0; i < players.length; i ++)
  	{
  		var player = players[i];
  		var player_object = new Player();
  		player_object.spawn(player);
  	}
});

socket.on("player joined", function(player) 
{
	console.log("New player joined: ", player);
    var player_object = new Player();
    player_object.spawn(player);
});

socket.on('player moved', function(player)
{
	console.log(player, player.id);
	console.log(Player.players);
	Player.players[player.id].update(player);
})

$(game.init);