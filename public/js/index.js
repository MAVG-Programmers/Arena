var socket = io();
var yourself;

var necessities = // These properties need to be true for the game to start
{
	yourself: 		false,
	game_options:   false,
	all_players:    false,
}

socket.emit("join");
socket.on("yourself update", function(you) 
{
	yourself = you;
	console.log('received update about yourself')
    $("#player-id").html("#" + yourself.index + " (" + yourself.id + ")");

    necessities['yourself'] = true;
    if (isGameReady()){$(game.init);}
});

socket.on("game options", function(obj) 
{
	console.log('received game options', obj);
	GAME = obj;

	necessities['game_options'] = true;
	if (isGameReady()){$(game.init);}
});

socket.on("all players", function(players) 
{
	console.log('received other players', players);
  	for (var i = 0; i < players.length; i ++)
  	{
  		var player = players[i];
  		var player_object = new Player();
  		player_object.spawn(player);
  	}

  	necessities['all_players'] = true;
  	if (isGameReady()){$(game.init);}
});

socket.on("player joined", function(player) 
{
	console.log("player joined: ", player);
    var player_object = new Player();
    player_object.spawn(player);
});

socket.on("player disconnect", function(player) 
{
	console.log("player disconnected: ", player);
	delete Player.players[player.id];
});

socket.on('player moved', function(player)
{
	Player.players[player.id].update(player);
})

function isGameReady()
{
	var ready = true;
	for (var key in necessities)
	{
		if (!necessities[key])
		{
			// something was not ready at this point
			ready = false;
			break;
		}
	}
	return ready;
}



