
var dataFiles= [
    { name: 'a10g', latMin:    50, latMax:     90, lngMin:   -180, lngMax:    -90, elMin:      1, elMax:    6098, columns:    10800, rows:   4800 },
    { name: 'b10g', latMin:    50, latMax:     90, lngMin:    -90, lngMax:      0, elMin:      1, elMax:    3940, columns:    10800, rows:   4800 },
    { name: 'c10g', latMin:    50, latMax:     90, lngMin:      0, lngMax:     90, elMin:    -30, elMax:    4010, columns:    10800, rows:   4800 },
    { name: 'd10g', latMin:    50, latMax:     90, lngMin:     90, lngMax:    180, elMin:      1, elMax:    4588, columns:    10800, rows:   4800 },
    { name: 'e10g', latMin:     0, latMax:     50, lngMin:   -180, lngMax:    -90, elMin:    -84, elMax:    5443, columns:    10800, rows:   6000 },
    { name: 'f10g', latMin:     0, latMax:     50, lngMin:    -90, lngMax:      0, elMin:    -40, elMax:    6085, columns:    10800, rows:   6000 },
    { name: 'g10g', latMin:     0, latMax:     50, lngMin:      0, lngMax:     90, elMin:   -407, elMax:    8752, columns:    10800, rows:   6000 },
    { name: 'h10g', latMin:     0, latMax:     50, lngMin:     90, lngMax:    180, elMin:    -63, elMax:    7491, columns:    10800, rows:   6000 },
    { name: 'i10g', latMin:   -50, latMax:      0, lngMin:   -180, lngMax:    -90, elMin:      1, elMax:    2732, columns:    10800, rows:   6000 },
    { name: 'j10g', latMin:   -50, latMax:      0, lngMin:    -90, lngMax:      0, elMin:   -127, elMax:    6798, columns:    10800, rows:   6000 },
    { name: 'k10g', latMin:   -50, latMax:      0, lngMin:      0, lngMax:     90, elMin:      1, elMax:    5825, columns:    10800, rows:   6000 },
    { name: 'l10g', latMin:   -50, latMax:      0, lngMin:     90, lngMax:    180, elMin:      1, elMax:    5179, columns:    10800, rows:   6000 },
    { name: 'm10g', latMin:   -90, latMax:    -50, lngMin:   -180, lngMax:    -90, elMin:      1, elMax:    4009, columns:    10800, rows:   4800 },
    { name: 'n10g', latMin:   -90, latMax:    -50, lngMin:    -90, lngMax:      0, elMin:      1, elMax:    4743, columns:    10800, rows:   4800 },
    { name: 'o10g', latMin:   -90, latMax:    -50, lngMin:      0, lngMax:     90, elMin:      1, elMax:    4039, columns:    10800, rows:   4800 },
    { name: 'p10g', latMin:   -90, latMax:    -50, lngMin:     90, lngMax:    180, elMin:      1, elMax:    4363, columns:    10800, rows:   4800 },
];

function init() { }    

var resolution= 120;

var indexLimits ;

function findFile( lng, lat ) {
    for ( var i in dataFiles ) {
        var df= dataFiles[i];
        if (df.latMin <= lat && df.latMax > lat && df.lngMin <= lng && df.lngMax > lng) {
            return df;
        }
    }
}

function fileIndex( lng, lat, fileEntry, resolution ) {
    var column= Math.floor(lng * resolution);
    var row= Math.floor(lat * resolution);
    var rowIndex= row - fileEntry.latMin * resolution;
    var columnIndex= column - fileEntry.lngMin * resolution;
    var index= ((fileEntry.rows - rowIndex - 1) * fileEntry.columns + columnIndex) * 2;
    return index;
};

function chunk (idx) {
    var index=indexLimits.findIndex(function(number) {
	return number > idx;
    });
    return index-1;
}

function chunkByte (idx) {
    var index=indexLimits.findIndex(function(number) {
	return number > idx;
    });
    return idx-indexLimits[index-1];
}

async function get_data(x,y) {
    z = [];
    var fileEntry= findFile(lon, lat);
    var totalBytes = fileEntry.columns * fileEntry.rows * 2;
    var pieceSize = totalBytes / 4;
    indexLimits = [0, pieceSize, pieceSize*2, pieceSize*3, pieceSize*4];
    console.log(totalBytes);
    console.log(indexLimits);
    promises = [];
    
    for (var i=0;i<x.length;i++) {
	var idx = fileIndex(x[i],y[i],fileEntry,resolution);
	chunkIdx = chunk(idx) + 1
	var url = "/alldata/globe/" + fileEntry['name'] + chunkIdx;
	var loc1 = chunkByte(idx);
	var loc2 = loc1 + 1;
	promises.push(
	    fetch(url, {
		headers: {
		    'content-type': 'multipart/byteranges',
		    'range': `bytes=${loc1}-${loc2}`,
		},
	    }));
    }
		     
    const responses = await Promise.all(promises);
    
    const data1 = await Promise.all( responses.map(response => response.arrayBuffer() ));
    
    const data2 = await Promise.all( data1.map(response => new Uint16Array(response) ));

    data2.forEach(function(x) {
	z.push(x[0]);
    });
    return z;
}

async function plot_elevation () {

    var fileEntry= findFile(lon, lat);
    var radius = parseInt(document.getElementById("radius").value);
    var S = 300;
    var LIM = 7000;

    var xmin = lon - (radius / S);
    var xmax = lon + (radius / S);
    var ymin = lat - (radius / S);
    var ymax = lat + (radius / S);

    console.log(xmin,xmax,ymin,ymax);

    var M = 10;
    var XWIN = (xmax-xmin) / M;    var YWIN = (ymax-ymin) / M;

    var x = [];
    var y = [];
    
    for (var i=xmin; i<xmax; i+=XWIN) {
	for (var j=ymin; j<ymax; j+=YWIN) {
	    x.push(i);
	    y.push(j);
	}
    }

    var z = await get_data(x,y);

    var z2 = z.map(function(x) {
	if (x<LIM) {
	    return x;
	} else {
	    return 0;
	}
    });
        
    var data = [ {
	x: x,
	y: y,
	z: z2,
	colorscale: "Earth",
	type: 'contour',
	showlabels: true,
	contours: {
	    coloring: 'lines',
	    showlabels: true
	} 
    } ];
    
    var layout = {
	xaxis: {
	    range: [xmin, xmax]  
	},
	yaxis: {
	    range: [ymin, ymax]  
	}	
    }

    Plotly.newPlot('myDiv', data, layout);    
}

function getLocation() {
    if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    document.getElementById("osmposition").innerHTML = lat + " " + lon;
}

