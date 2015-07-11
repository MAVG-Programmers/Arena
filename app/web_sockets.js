var crypto = require("crypto"),
    players = [];
    CONSTANTS = {
        PLAYER: {
            SPEED: 5,
            JUMP: -10,
        },
        BULLET: {
            SPEED: 15,
        },
        GRAVITY: 0.4
    };

function Player() {
    var id;

    this.x = Math.random() * 500;
    this.y = Math.random() * 500;
    this.inAir = true;
    this.speed = {
        x: 0,
        y: 0
    };

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

Player.updatePlayers = function()
{
    for (var i = 0; i < players.length; i ++)
    {
        players[i].update();
    }
}

Player.prototype.update = function() {
    this.x += this.speed.x * CONSTANTS.PLAYER.SPEED;

    if (this.inAir){
        this.speed.y += CONSTANTS.GRAVITY;
        this.y += this.speed.y;
    }

    io.transmitPosition(this);
};

function initialize(io_obj) {
    io = io_obj;
    io.on("connection", function(socket) {
        console.log(socket.handshake.address + " connected.");

        socket.on("join", function() {
            var player = new Player();
            socket.player = player;

            socket.emit("constants", CONSTANTS);
            socket.emit("all players", players);

            socket.emit("yourself update", player);
            socket.broadcast.emit("player joined", player);

            console.log("New player joined.")
        });

        socket.on("move", function(move) {
            try{
            socket.player.speed.x = move;
            }
            catch(e){}
        });

        socket.on("on ground", function() {
            try{
            socket.player.speed.y = 0;
            socket.player.inAir = false;
            }
            catch(e){}
        });

        socket.on("in air", function() {
            try{
            socket.player.inAir = true;
            }
            catch(e){}
        });

        socket.on("jump", function() {
            try{
            socket.player.speed.y = CONSTANTS.PLAYER.JUMP;
            socket.player.inAir = true;
            }
            catch(e){}
        });

        socket.on("disconnect", function() {
            if(players.indexOf(socket.player) > -1) {
                players.splice(players.indexOf(socket.player), 1);
                console.log("Player disconnected: " + socket.player.id);
                delete socket.player;
            }
        });
    });

    io.transmitPosition = function(player)
    {
        io.sockets.emit('player update', player);
    }

    console.log("Socket.IO ready.");
}

setInterval(function()
{
    Player.updatePlayers();
}, 20)

module.exports = initialize;