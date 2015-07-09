console.log('collision init')

var debugRect = 
{
	x: 		300, 
	y: 		250, 
	width: 	100,
	height:  50,
}

var debugCollisionManager = new CollisionManager();

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
}