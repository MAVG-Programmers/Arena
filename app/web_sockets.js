var crypto = require("crypto"),
    players = [];
    GAME = 
    {
        PLAYER:
        {
            SPEED: 5
        },
        BULLET:
        {
            SPEED: 15,
        },
        GRAVITY:      1,
    }



function Player() {
    var id;

    this.x = Math.random()*500;
    this.y = Math.random()*500;
    this.inAir = true;
    this.speed = {x: 0, y: 0};

    this.updatePosition = function(angle)
    {
        this.x += Math.cos(angle)*GAME.PLAYER.SPEED;
        this.y += Math.sin(angle)*GAME.PLAYER.SPEED;
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

            socket.emit("game options", GAME);
            socket.emit("all players", players);

            socket.emit("yourself update", player);
            socket.broadcast.emit("player joined", player);

            console.log('new player joined.')
        });

        socket.on('move', function(angle)
        {
            socket.player.updatePosition(angle);
            io.sockets.emit('player moved', socket.player);
        });

        socket.on('disconnect', function()
        {
            if (players.indexOf(socket.player) > -1)
            {
                players.splice(players.indexOf(socket.player), 1);
                console.log('player dc: ' + socket.player.id);
                delete socket.player;
            }
        });
    });

    console.log("Socket.IO ready.");
}

module.exports = initialize;