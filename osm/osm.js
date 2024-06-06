
function init()  {
    init_cookies(); 
}

function getLocation() {
    if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function display_map() {
    map = L.map('map').setView([lat,lon], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'ddd'
    }).addTo(map);
    markers = [];
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
    var orangeIcon = new LeafIcon({iconUrl: '../travel/marker-icon-2x-orange.png'});
    L.marker([lat,lon], {icon: orangeIcon}).addTo(map);    
}

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    document.getElementById("osmposition").innerHTML = lat + " " + lon;
    document.getElementById("osmentry").style.display = "block";
    display_map();
}

function getLocationFromPicker() {
    coords = sessionStorage.getItem('picker_coord').split(" ");
    lat = parseFloat(coords[0]);
    lon = parseFloat(coords[1]);
    document.getElementById("osmposition").innerHTML = lat + " " + lon;
    document.getElementById("osmentry").style.display = "block";
    display_map();
}

function show() {

    var type = document.getElementById("amenity_type").value;
    var name = document.getElementById("amenity_name").value;
    var dist = parseInt(document.getElementById("amenity_dist").value);

    console.log(name);
    console.log(type);
    console.log(dist);

    for(var i = 0; i < this.markers.length; i++){
	map.removeLayer(this.markers[i]);
    }
    
    tbody = `[out:json];node['amenity'~'${type}'](around:${dist},${lat},${lon});out center;`
    if (type == 'mall') {
	tbody = `[out:json];node['shop'='mall'](around:${dist},${lat},${lon});out center;`
    }
    if (type == 'camp') {
	tbody = `[out:json];node['tourism'='camp_site'](around:${dist},${lat},${lon});out center;`
    }
        
    (async () => {
	const api = await fetch('https://www.overpass-api.de/api/interpreter?', {
	    method: 'POST',
	    headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	    },
	    body: tbody
	});
	const answer = await api.json();
	elems = answer['elements'];
	markers = []
	elems.forEach(function(x) {
	    skip = false;
	    currname = String(x['tags']['name']).toLowerCase();
	    if (currname.length > 0 && !currname.includes(name.toLowerCase())) skip = true;
	    if (!skip) {
		var m = L.marker([x['lat'],x['lon']]).addTo(map);
		markers.push(m);
		m.bindPopup(x['tags']['name']).openPopup();
	    }
	});
		
    })()    

    
}


