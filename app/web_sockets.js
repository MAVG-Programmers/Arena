var crypto = require("crypto"),
    
    players = [];

function Player() {
    var id;

    //Each player is assigned a 32-character (hex is 2 characters per bit) random ID
    //If there's a collision (effectively impossible, but still technically possible), the ID is regenerated until unique
    id = crypto.randomBytes(16).toString("hex");

    for(var i = 0; Player.find("id", id); i++) {
        id = crypto.randomBytes(16).toString("hex");
    }

    this.id = id;
    this.index = players.length;

    players.push(this);
}

//This is a simple search function that can be used to iterate through all the players and check a given key for a given value
Player.find = function(key, val) {
    for(var player in players) {
        if(players[player][key] === val) {
            return players[player];
        }
    }

    return false;
};

function initialize(io) {
    io.on("connection", function(socket) {
        console.log(socket.handshake.address + " connected.");

        socket.on("join", function() {
            var player = new Player();
            socket.player = player;

            socket.emit("player_update", player);

            /*socket.broadcast.emit("joined", {
                player: player
            });*/
        });
    });

    console.log("Socket.IO ready.");
}

module.exports = initialize;