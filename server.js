var path = require("path");

//Global variables are bad, but this prevents us from having to pass around __dirname__ to our internal modules
global.app_root_dir = path.resolve(__dirname);

require("./app/web");