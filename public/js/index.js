var socket = io(),
    yourself;

//These properties need to be true for the game to start
var necessities = {
    yourself: false,
    game_options: false,
    all_players: false,
};

function receiveConfiguration(key) {
    var ready = true;
    necessities[key] = true;
    
    if(game.initialized) {
        return;
    }

    for(var key in necessities) {
        if(!necessities[key]) {  
            return;
        }
    }

    $(game.init());
}

socket.emit("join");
socket.on("yourself update", function(you) {
    console.log("received update about yourself")

    yourself = you;
    $("#player-id").html("#" + yourself.index + " (" + yourself.id + ")");

    receiveConfiguration("yourself");
});

socket.on("game options", function(obj) {
    console.log("received game options", obj);
    GAME = obj;

    receiveConfiguration("game_options");
});

socket.on("all players", function(players) {
    console.log("Received other players.", players);
    
    for(var i = 0; i < players.length; i++) {
        var player = players[i];
        var player_object = new Player();
        player_object.spawn(player);
    }

    receiveConfiguration("all_players");
});

socket.on("player joined", function(player) {
    var player_object = new Player();
    console.log("Player joined: ", player);
    player_object.spawn(player);
});

socket.on("player disconnect", function(player) {
    console.log("Player disconnected: ", player);
    delete Player.players[player.id];
});

socket.on("player moved", function(player) {
    Player.players[player.id].update(player);
});