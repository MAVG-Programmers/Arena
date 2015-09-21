var keystroke_objs = [],
    heldkeys = {},
    mouse = {};
    KEYS = {
        RIGHT: 39,
        LEFT: 37,
        UP: 38,
        DOWN: 40,
        SPACE: 32,
    };

//This can be used to register a keystroke with a number of options for controlling its behavior.
//Simplest usage:
// registerKeystroke({
//     key: KEYS.RIGHT,
//     fn: function() {
//         alert("Right arrow key pressed.");
//     }
// });
//
//The `key` can also be an array of key codes instead of just one. The object returned carries an .unregister()
//method that can be used to remove the keystroke handler. Other options include `repeat`, which specifies how many
//times the keystroke can be triggered before unregistering itself, and `node`, which is a reference to an element
//that must be in focus for the keystroke to be triggered.
function registerKeystroke(options) {
    if(typeof options.key === "number") { options.key = [key]; }

    var keystroke = {
        key: options.key,
        fn: options.fn,
        index: keystroke_objs.length - 1,
        unregister: function() {
            keystroke_objs.splice(this.index, 1);
        }
    };

    $.extend(keystroke, options);
    keystroke_objs.push(keystroke);

    return keystroke;
}

$(function() {
    $(document).keypress(function(e) {
        var keystroke, node;

        //Loop through all registered keystrokes
        for(var i = 0; i < keystroke_objs.length; i++) {
            keystroke = keystroke_objs[i];
            node = keystroke.node;

            //If the key code matches and the node is in focus, run the registered function
            if(keystroke.key.indexOf(e.which) !== -1 && (!node || $(node).is(":focus"))) {
                keystroke.fn();

                //Keystroke repeat limit
                if(keystroke.repeat) {
                    keystroke.repeat--;

                    if(keystroke.repeat === 0) {
                        keystroke.unregister();
                    }
                }
            }
        }
    }).keydown(function(e) {
        heldkeys[e.which] = true;
    }).keyup(function(e) {
        //Setting to false leaves the property intact and takes up unnecessary memory, but using delete is massively slower (see http://jsperf.com/delete-vs-false/2)
        heldkeys[e.which] = false;
    });
})

function getMousePos(canvas, e) {
    var res = {};

    if(e.offsetX) {
        res.x = e.offsetX;
        res.y = e.offsetY;
    } else if(e.layerX) {
        res.x = e.layerX;
        res.y = e.layerY;
    }

    return res;
}

addEventListener("mousemove", function(e) {
    mouse = getMousePos(game.canvas, e);
}, false);

addEventListener("mousedown", function() {
	//tell server to create a new bullet if your cooldown has reached 0
	if(Player.players[yourself.id].curCoolDown == 0) {
		socket.emit("createBulletServer");
	}
}, false);