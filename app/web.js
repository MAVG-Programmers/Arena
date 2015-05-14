var port = +process.env.PORT || 8080,
    http = require("http"),
    express = require("express"),
    bodyParser = require("body-parser"),
    ejs = require("ejs"),
    socketio = require("socket.io"),
    
    app = express(),
    server = http.createServer(app),
    io;

//Environment setup
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set("views", global.app_root_dir + "/views");
app.use(express.static(global.app_root_dir + "/public"));
io = socketio(server);
server.listen(port);
console.log("Server ready on port " + port + ".");

require("./web_routes")(app);
require("./web_sockets")(io);