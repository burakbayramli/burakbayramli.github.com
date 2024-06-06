
function init()  {
    init_cookies(); 
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

function getLocationFromPicker() {
    coords = sessionStorage.getItem('picker_coord').split(" ");
    lat = parseFloat(coords[0]);
    lon = parseFloat(coords[1]);
    document.getElementById("osmposition").innerHTML = lat + " " + lon;
}

function in_tens(x) {
    return parseInt(parseInt(parseFloat(parseInt(x)) / 10)*10);
}

function plot_elevation () {

    latint = parseInt(lat);
    lonint = parseInt(lon);

    tenslat = in_tens (latint);
    tenslon = in_tens (lonint);

    console.log(latint,lonint,tenslat,tenslon);
    
    url = `/elev/data/out-${tenslat}-${tenslon}.json`;    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url = url, false ); 
    xmlHttp.send( null );
    result = xmlHttp.responseText;

    res = JSON.parse(result);

    W = 1/120
    x = [];
    y = [];
    for (var j=latint+1;j>latint+W;j-=W) {
	y.push (j);
    }
    for (var i=lonint;i<lonint+1-W;i+=W) {
	x.push (i);
    }    

    var key = `${latint}-${lonint}`;
    var data = [ {
	x: x,
	y: y,
	z: res[key],
	colorscale: "Earth",
	type: 'contour',
	showlabels: true,
	contours: {
	    coloring: 'lines',
	    showlabels: true,
	    start: 0,
	    end: 600,
	    size: 100
	} 
    } ];

    var radius = parseInt(document.getElementById("radius").value);
    console.log(radius);
    console.log(lat);
    console.log(lon);
    var S = 20;
    var xmin = lon - (radius / S);
    var xmax = lon + (radius / S);
    var ymin = lat - (radius / S);
    var ymax = lat + (radius / S);
    console.log(xmin,xmax,ymin,ymax);
    
    var layout = {
	title: 'Basic Contour Plot',
	xaxis: {
	    range: [xmin, xmax]  
	},
	yaxis: {
	    range: [ymin, ymax]  
	}	
    }

    Plotly.newPlot('myDiv', data, layout);    
}
