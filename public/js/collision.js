console.log('collision init')

function CollisionManager()
{
	this.AABB = function(a, b) // a and b are objects with the following properties required : x, y, width, height
	{
		var collide_x = false;
		var collide_y = false;
		if (a.x + a.width >= b.x && a.x <= b.x + b.width)
		{
			collide_x = true;
		}
		if (a.y + a.height >= b.y && a.y <= b.y + b.height)
		{
			collide_y = true;
		}

		if (collide_x && collide_y)
		{
			return true; // Objects are colliding
		}
		else
		{
			return false; // Objects are not colliding
		}
	}

	this.isInsideBounds = function(a) // a is an object with the following properties required : x, y, width, height
	{
		var inside = {x: true, y: true};

		if (a.x < 0 || a.x + a.width > game.width)
		{
			inside.x = false;
		}

		if (a.y < 0 || a.y + a.height > game.height)
		{
			inside.y = false;
		}

		return inside;
	}
}

var collisionManager = new CollisionManager();