function decodeMap(encoded) {
    var data = encoded.split("/"),
        lines = data[3].split("|"),
        output = [],
        block, count;

    //Loop through each pipe-delimited line
    for(var i = 0; i < lines.length; i++) {
        output[i] = "";
        lines[i] = lines[i].split(";");

        //Loop through each semicolon-delimited block series
        for(var u = 0; u < lines[i].length; u++) {
            //Split to get the block and the count
            block = lines[i][u].split(" ");
            count = parseInt(block[1], 10);
            block = block[0];

            //Block series with only one instance have no count, so we only need to append them
            if(!count) {
                output[i] += block;
            } else {
                //Create an empty array with count+1 elements, then join them with the block character
                //This is essentially a polyfill for .repeat()
                output[i] += new Array(count + 1).join(block);
            }
        }
    }

    //Join the output array with newlines to produce the map
    return {
        version: data[0],
        name: data[1],
        creator: data[2],
        map: output.join("\n")
    };
}

function generateMapSquare(x, y, square) {
    if(square === "1") {
        new Platform({
            x: x * Platform.WIDTH,
            y: y * Platform.HEIGHT,
            width: Platform.WIDTH,
            height: Platform.HEIGHT
        });
    }
}

function generateMap(map) {
    map = map.split("\n");

    for(var y = 0; y < map.length; y++) {
        for(var x = 0; x < map[y].length; x++) {
            generateMapSquare(x, y, map[y][x]);
        }
    }
}

function decodeAndGenerate(encoded) {
    generateMap(decodeMap(encoded).map);
}