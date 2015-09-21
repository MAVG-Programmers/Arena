var crypto = require("crypto"),
    players = [];
    bullets = [];
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

    this.x = 250;
    this.y = 200;
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

function Bullet() {
    var id;

    this.x = 250;
    this.y = 200;
    this.inAir = true;
    this.speed = {
        x: 0,
        y: 0
    };

    //Each bullet is assigned a 32-character (hex is 2 characters per bit) random ID - like players
    //If there's a collision (effectively impossible, but still technically possible), the ID is regenerated until unique
    id = crypto.randomBytes(16).toString("hex");

    for(var i = 0; Bullet.find("id", id); i++) {
        id = crypto.randomBytes(16).toString("hex");
    }

    this.id = id;
    this.index = bullets.length;

    bullets.push(this);
}

//This is a simple search function that can be used to iterate through all the bullets and check a given key for a given value
Bullet.find = function(key, val) {
    for(var bullet in bullets) {
        if(bullets[bullet][key] === val) {
            return bullets[bullet];
        }
    }
    return false;
};

Bullet.removeBullet = function(key, val) {
    for(var bullet in bullets) {
        if(bullets[bullet][key] === val) {
            bullets.splice(bullet, 1);
        }
    }
};

Bullet.updateBullets = function() {
    for (var i = 0; i < bullets.length; i++)
    {
        bullets[i].update();
    }
}

Bullet.prototype.update = function() {
	this.x += this.speed.x * CONSTANTS.BULLET.SPEED;
	this.y += this.speed.y * CONSTANTS.BULLET.SPEED;

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

        socket.on("createBulletServer", function() {
			//create a new bullet, pass the bullet ID back to the client
            var bullet = new Bullet();
			socket.emit("createBulletClient", {id:bullet.id});
        });
		
		socket.on("destroyBulletServer", function(bullet) {
			//remove bullet from server's list of bullets
			Bullet.removeBullet("id",bullet.id);
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
    Bullet.updateBullets();
}, 20)

module.exports = initialize;