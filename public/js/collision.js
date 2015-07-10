console.log("Collision initialized.");

function CollisionManager() {
    //a and b are objects with the following properties required: x, y, width, height
    this.AABB = function(a, b) {
        var collide_x = false,
            collide_y = false;

        if(a.x + a.width >= b.x && a.x <= b.x + b.width) {
            collide_x = true;
        }
        
        if(a.y + a.height >= b.y && a.y <= b.y + b.height) {
            collide_y = true;
        }

        if(collide_x && collide_y) {
            return true;
        } else {
            return false;
        }
    }

    //a is an object with the following properties required: x, y, width, height
    this.isInsideBounds = function(a) {
        var inside = {
            x: true,
            y: true
        };

        if(a.x < 0 || a.x + a.width > game.width) {
            inside.x = false;
        }

        if(a.y < 0 || a.y + a.height > game.height) {
            inside.y = false;
        }

        return inside;
    }
}

var collisionManager = new CollisionManager();