var crypto = require("crypto"),
    
    players = [];

function Player() {
    var id;

    this.x = Math.random()*500;
    this.y = Math.random()*500;

    this.updatePosition = function(angle)
    {
        console.log(angle);
        this.x += Math.cos(angle)*Player.speed;
        this.y += Math.sin(angle)*Player.speed;
    }

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

Player.speed = 1;

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

            socket.emit("other players", players);

            var player = new Player();
            socket.player = player;

            socket.emit("player update", player);
            socket.broadcast.emit("player joined", player);

            console.log('new player joined.')
        });

        socket.on('move', function(angle)
        {
            socket.player.updatePosition(angle);
            socket.broadcast.emit('player moved', socket.player);
        });

        socket.on('disconnect', function()
        {
            if (players.indexOf(socket.player) > -1)
            {
                players.splice(players.indexOf(socket.player), 1);
                delete socket.player;
                console.log('player dc: ' + socket.player.id);
            }
        });
    });

    console.log("Socket.IO ready.");
}

module.exports = initialize;