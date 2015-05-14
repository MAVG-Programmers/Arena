var path = require("path");

global.app_root_dir = path.resolve(__dirname);

require("./app/web");