
var LeafIcon = L.Icon.extend({
    options: {
        shadowUrl: '../travel/marker-shadow.png',
        iconSize:     [20, 40],
        shadowSize:   [25, 30],
        iconAnchor:   [10, 45],
        shadowAnchor: [2, 30],
        popupAnchor:  [-1, -30]
    }
});

var currLocMarker = null;

function markLocation() {
    if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(markLocationCallback);
    }
}

function markLocationCallback(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    var orangeIcon = new LeafIcon({iconUrl: '../travel/marker-icon-2x-orange.png'});
    if (typeof lat !== 'undefined') {
	if (currLocMarker != null) {
	    map.removeLayer(currLocMarker);
	}
	currLocMarker = L.marker([lat,lon], {icon: orangeIcon});
	currLocMarker.addTo(map);
    }
    
}

function setCurrentFrom() {
    if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(setCurrentFromCallback);
    }
}

function setCurrentFromCallback(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    document.getElementById("coordfr").value = lat + "," + lon;    
}

function setCurrentTo() {
    if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(setCurrentToCallback);
    }
}

function setCurrentToCallback(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    document.getElementById("coordto").value = lat + "," + lon;
}

function setPickerFrom() {
    coords = prefs['picker']['coord'].split(" ");
    lat = parseFloat(coords[0]);
    lon = parseFloat(coords[1]);
    document.getElementById("coordfr").value = lat + "," + lon;    
}

function setPickerTo() {
    coords = prefs['picker']['coord'].split(" ");
    lat = parseFloat(coords[0]);
    lon = parseFloat(coords[1]);
    document.getElementById("coordto").value = lat + "," + lon;    
}

function init()  {
    init_cookies();
}

function shortest() {

    //var [lat1, lon1] = [40.976010662280586, 29.081443051759983];
    //var [lat2, lon2] = [37.377289145215066, 27.295607731239233];
    coords = document.getElementById("coordfr").value.split(",");
    var [lat1, lon1] = coords;
    coords = document.getElementById("coordto").value.split(",");
    var [lat2, lon2] = coords;

    url = `http://router.project-osrm.org/route/v1/car/${lon1},${lat1};${lon2},${lat2}?alternatives=false`;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url = url, false ); 
    xmlHttp.send( null );
    result = JSON.parse(xmlHttp.responseText);
    encoded = result['routes'][0]['geometry'];
    var coordinates = polyline.decode(encoded);
    var c = coordinates[0];

    map = L.map('map').setView([c[0],c[1]], 7);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'OSM'
    }).addTo(map);

    var line = new L.Polyline(coordinates, {
	color: 'red', weight: 2, opacity: 0.5, smoothFactor: 1
    });
    line.addTo(map);        
}
