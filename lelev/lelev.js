
var KM_DEG = 0.009;

function init() { }

function getLocation() {
    if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    document.getElementById("position").innerHTML = lat + " " + lon;    
}

function getLocationFromPicker() {
    var prefs = get_prefs();
    coords = prefs['picker']['coord'].split(" ");
    lat = parseFloat(coords[0]);
    lon = parseFloat(coords[1]);
    document.getElementById("position").innerHTML = lat + " " + lon;    
}

function degToRad(deg) {
    return deg * (Math.PI / 180.0);
}

function goto(fr, a, d) {
   
    var D = d*KM_DEG;
    var res = [];
    var P  = D / ELEV_GRID_N;
    for (var i=0;i<ELEV_GRID_N; i++) {
	lat = fr[0] + (P*i)*Math.sin(a);
	lon = fr[1] + (P*i)*Math.cos(a);
	res.push([lat,lon]);
    }
    return res;
}

async function calc() {

    var deg = document.getElementById("deg_id").value;
    var dist = parseFloat(document.getElementById("dist_id").value);

    var P = dist / ELEV_GRID_N;
    var xs = [];
    for (var i=0;i<ELEV_GRID_N;i++){
	xs.push(P*i);
    }
    
    coords = goto([lat,lon],degToRad(deg),dist);
    x = []; y = [];
    coords.forEach(function (item) {
	x.push(item[1])
	y.push(item[0]);
    });

    var z = await get_data(x,y);
    
    var zs = z.map(function(x) {
	if (x<ELEV_LIM) {
	    return x;
	} else {
	    return 0;
	}
    });
    
    G = document.getElementById('elevgraph');
    var layout = {
	title: { text:'Elevation' }
    };
    Plotly.newPlot( G, [{ x: xs, y: zs }], layout );
}

