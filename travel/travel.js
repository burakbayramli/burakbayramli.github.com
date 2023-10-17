
function init() {
    show_plans();
}

function get_data(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url = url, false ); 
    xmlHttp.send( null );
    result = xmlHttp.responseText;
    return result;
}

function getLocation() {
    if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    out = "<br/>" + lat + " " + lon;
    document.getElementById("position").innerHTML = out;
}

function get_paths(gpx) {
    const re = /<trkseg>[^\0]*?<\/trkseg>/gm;
    const segments = gpx.match(re);
    all_res = [];
    segments.forEach(function(segment) {
	const re2 = /trkpt lat="\d+\.\d+"\s+lon="\d+\.\d+"/mg;
	segment = segment.match(re2);
	res = []
	segment.forEach(function(x) {
	    xx = x.replace('trkpt lat=','');
	    xx = xx.replace('lon=','');
	    xx = xx.replace(/"/g, '');
	    xx = xx.split(' ');
	    res.push([parseFloat(xx[0]), parseFloat(xx[1])]);
	});
	all_res.push(res);
    });
    
    return all_res;
}

function remove(url) {
    prefs = get_prefs();
    delete prefs['travel'][url];
    save_cookie(prefs);
    show_plans();
}

function show_plans() {
    init_cookies();    
    prefs = get_prefs();
    out = "";
    out += "<h5>Plans</h5>";
    Object.keys(prefs['travel']).forEach(function(key) {
	var urldesc = key.replace("http://","");
	var urldesc = urldesc.replace("https://","");
	out += `<a onclick='show_plan("${key}")' href='#'>${urldesc}</a><span class='remove'><a onclick='remove("${key}")' href='#'>Remove</a></span><br/>`;
    })      
    document.getElementById("plans").innerHTML = out;    
}

function show_plan(mainurl) {
    main = JSON.parse(get_data(mainurl));

    map = L.map('map').setView([main['center'][0],main['center'][1]], 10);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'OSM'
    }).addTo(map);

    var m = L.marker([main['center'][0],main['center'][1]]).addTo(map);
    
    Object.keys(main['points']).forEach(function(key) {
	var m = L.marker([main['points'][key][0], main['points'][key][1]]).addTo(map);
	m.bindPopup(key).openPopup();
    });
            
    main['maps'].forEach(function(currurl) {
	url = mainurl.substring(0,mainurl.lastIndexOf("/")+1) + currurl;
	paths = get_paths(get_data(url));

	paths.forEach(function(path) {
	    var line = new L.Polyline(path, {
		color: 'red', weight: 1, opacity: 0.5, smoothFactor: 1
	    });
	    line.addTo(map);
	});
    });    
}

function add_url() {
    var new_url = document.getElementById("new_url").value;    
    prefs = get_prefs();
    prefs['travel'][new_url] = "1";
    save_cookie(prefs);
    show_plans();
}
