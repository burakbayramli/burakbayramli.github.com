
function init()  {
    if(typeof lat === 'undefined') {
	document.getElementById("osmposition").innerHTML = "<font color='red'>Position not set</font>";
    }
    
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
    document.getElementById("osmentry").style.display = "block";
    map = L.map('map').setView([lat,lon], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'ddd'
    }).addTo(map);
    markers = [];
}


function test1() {

    (async () => {
	const api = await fetch('https://www.overpass-api.de/api/interpreter?', {
	    method: 'POST',
	    headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	    },
	    body:`[out:json];node['amenity'~'cafe'](around:500,${lat},${lon});out center;`
	});
	const answer = await api.json();
	elems = answer['elements'];
	elems.forEach(function(x) {
	    var m = L.marker([x['lat'],x['lon']]).addTo(map);
	    m.bindPopup(x['tags']['name']).openPopup();
	});
	
    })()    

}
    

function test2() {

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
