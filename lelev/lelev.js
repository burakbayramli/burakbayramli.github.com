
KM_DEG = 0.009;
N = 30;

function init() {
}

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
    var P  = D / N
    for (var i=0;i<N; i++) {
	lat = fr[0] + (P*i)*Math.sin(a);
	lon = fr[1] + (P*i)*Math.cos(a);
	res.push([lat,lon]);
    }
    return res;
}

function calc() {

    var deg = document.getElementById("deg_id").value;
    var dist = parseFloat(document.getElementById("dist_id").value);

    var P = dist /  N;
    var xs = [];
    for (var i=0;i<N;i++){
	xs.push(P*i);
    }
    
    coords = goto([lat,lon],degToRad(deg),dist);
    
    pars = coords.join("|");
    
    url = `https://api.open-elevation.com/api/v1/lookup?locations=${pars}`;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url = url, false ); 
    xmlHttp.send( null );
    result = JSON.parse(xmlHttp.responseText);
    console.log(result['results']);
    ys = [];
    result['results'].forEach(function(x){
	ys.push(parseFloat(x['elevation']));
    });

    G = document.getElementById('elevgraph');
    var layout = {
	title: { text:'Elevation' }
    };
    Plotly.newPlot( G, [{ x: xs, y: ys }], layout );    
}

