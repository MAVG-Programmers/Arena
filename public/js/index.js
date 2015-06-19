var socket = io();

socket.emit("join");
socket.on("player_update", function(player) {
    $("#player-id").html("#" + player.index + " (" + player.id + ")");
});

audio.init();