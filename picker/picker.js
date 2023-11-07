
function show() {
    init_cookies();     

    var map = L.map('map').setView([40,30], 4);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'ddd'
    }).addTo(map);

    map.on('click', function(e){
	var coord = e.latlng;
	var latclick = coord.lat;
	var lngclick = coord.lng;
	var s = "Picked Click: " + latclick + " " + lngclick;
	document.getElementById('picked').innerHTML = s;
	prefs['picker']['coord'] = latclick + " " + lngclick;
	save_cookie(prefs);
    });    
}

function set_named_pick() {
    var name = document.getElementById("myInput").value;
    console.log(name);
    var s = "Picked Name: " + cities_dict[name];
    document.getElementById('picked').innerHTML = s;
    prefs['picker']['coord'] = cities_dict[name];
    save_cookie(prefs);
}
