function initialize(app) {
    app.get("/", function(req, res) {
        "use strict";
        res.render("index");
    });
}

module.exports = initialize;