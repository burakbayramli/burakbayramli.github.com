
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
	urldesc = urldesc.replace("https://","");
	urldesc1 = urldesc.slice(0,10);
	urldesc2 = urldesc.slice(urldesc.length-20,urldesc.length);
	out += `<a onclick='show_plan("${key}")' href='#'>${urldesc1} .. ${urldesc2}</a><a class='rmblock' onclick='remove("${key}")' href='#'>Remove</a><br/>`;
    })      
    document.getElementById("plans").innerHTML = out;    
}

function show_plan(mainurl) {
    main = JSON.parse(get_data(mainurl));

    var LeafIcon = L.Icon.extend({
	options: {
            shadowUrl: 'marker-shadow.png',
            iconSize:     [20, 40],
            shadowSize:   [25, 30],
            iconAnchor:   [10, 45],
            shadowAnchor: [2, 30],
            popupAnchor:  [-1, -30]
	}
    });
       
    map = L.map('map').setView([main['center'][0],main['center'][1]], 10);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'OSM'
    }).addTo(map);

    var orangeIcon = new LeafIcon({iconUrl: 'marker-icon-2x-orange.png'});
    var yellowIcon = new LeafIcon({iconUrl: 'marker-icon-2x-yellow.png'});
    var greenIcon = new LeafIcon({iconUrl: 'marker-icon-2x-green.png'});
    
    if (typeof lat !== 'undefined') {
	L.marker([lat,lon], {icon: orangeIcon}).addTo(map);
    }
	    
    Object.keys(main['restaurants']).forEach(function(key) {
    	L.marker([main['restaurants'][key][0], main['restaurants'][key][1]],{icon: yellowIcon}).bindPopup(key).openPopup().addTo(map)
    });
            
    Object.keys(main['campgrounds']).forEach(function(key) {
    	L.marker([main['campgrounds'][key][0], main['campgrounds'][key][1]],{icon: greenIcon}).bindPopup(key).openPopup().addTo(map);
    });
            
    Object.keys(main['points']).forEach(function(key) {
	L.marker([main['points'][key][0], main['points'][key][1]]).bindPopup(key).openPopup().addTo(map);
    });
            
    main['maps'].forEach(function(currurl) {
	url = mainurl.substring(0,mainurl.lastIndexOf("/")+1) + currurl;
	paths = get_paths(get_data(url));

	paths.forEach(function(path) {
	    var line = new L.Polyline(path, {
		color: 'red', weight: 2, opacity: 0.5, smoothFactor: 1
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
