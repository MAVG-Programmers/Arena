var crypto = require("crypto"),
    
    players = [];

function Player() {
    var id;

    id = crypto.randomBytes(16).toString("hex");

    for(var i = 0; Player.find("id", id); i++) {
        id = crypto.randomBytes(16).toString("hex");
    }

    this.id = id;
    this.index = players.length;

    players.push(this);
}

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