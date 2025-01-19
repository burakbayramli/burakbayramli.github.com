
var cols = ["GLOBALEVENTID", "SQLDATE", "MonthYear", "Year", "FractionDate", "Actor1Code", "Actor1Name", "Actor1CountryCode", "Actor1KnownGroupCode", "Actor1EthnicCode", "Actor1Religion1Code", "Actor1Religion2Code", "Actor1Type1Code", "Actor1Type2Code", "Actor1Type3Code", "Actor2Code", "Actor2Name", "Actor2CountryCode", "Actor2KnownGroupCode", "Actor2EthnicCode", "Actor2Religion1Code", "Actor2Religion2Code", "Actor2Type1Code", "Actor2Type2Code", "Actor2Type3Code", "IsRootEvent", "EventCode", "EventBaseCode", "EventRootCode", "QuadClass", "GoldsteinScale", "NumMentions", "NumSources", "NumArticles", "AvgTone", "Actor1Geo_Type", "Actor1Geo_FullName", "Actor1Geo_CountryCode", "Actor1Geo_ADM1Code", "Actor1Geo_Lat", "Actor1Geo_Long", "Actor1Geo_FeatureID", "Actor2Geo_Type", "Actor2Geo_FullName", "Actor2Geo_CountryCode", "Actor2Geo_ADM1Code", "Actor2Geo_Lat", "Actor2Geo_Long", "Actor2Geo_FeatureID", "ActionGeo_Type", "ActionGeo_FullName", "ActionGeo_CountryCode", "ActionGeo_ADM1Code", "ActionGeo_Lat", "ActionGeo_Long", "ActionGeo_FeatureID", "DATEADDED","SOURCEURL"];

function display_map() {
    map = L.map('map').setView([30,0], 1.5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'OSM'
    }).addTo(map);
    markers = [];
}

function plotConflicts() {
    var d = document.getElementById("demo-1").value;
    var day = d.substr(0,2);
    var mon = d.substr(3,2);
    var year = d.substr(6,4);
    var day = `${year}${mon}${day}`;
    showMap(day);
}

function init() {
    document.getElementById("waiting").style.display = "none";
    document.getElementById("output").innerHTML = "&nbsp;Choose date and click plot";
    display_map();
}

function showMap(day) {
    document.getElementById("waiting").style.display = "block";
    document.getElementById("output").innerHTML = "";
    var col_d = {};
    var i = 0;
    for (i = 0; i < cols.length; i++) {
	col_d[cols[i]] = i;
    }
    
    for(var i = 0; i < this.markers.length; i++){
	map.removeLayer(this.markers[i]);
    }
    if (this.markers.length > 0) {
	this.markers = [];
    }
    
    var url = `https://raw.githubusercontent.com/muratk5n/gdelt/main/${day}.export.CSV.zip`;

    fetch(url).then(res => res.arrayBuffer()).then(arrayBuffer => {
	var i = 0;
	var new_zip = new JSZip();
	new_zip.loadAsync(arrayBuffer)
	.then(function(zip) {
	    var res = zip.file(`${day}.export.CSV`).async('string');
	    return res;
	}).then(function(text) {
	    var lines = text.split('\n');
	    lines.forEach(function(line) {
		i = i + 1;
		var tokens = line.split('\t');
		var [lat,lon] = [tokens[col_d['Actor1Geo_Lat']], tokens[col_d['Actor1Geo_Long']]];
		var code = tokens[col_d['Actor1Type1Code']];
		if (lat != undefined && code == 'MIL') {
		    var surl = tokens[col_d['SOURCEURL']];
		    var surl_desc = surl.substr(11,10) + "...";
		    var pop = `<a href="${surl}" target="_blank">${surl_desc}</a>`;
		    var m = L.circleMarker( [lat,lon], {radius: 1, color: 'red'} ).bindPopup(pop).addTo( map );
		    this.markers.push(m);
		}
				
	    });
	}).then(function(done) {
	    console.log('done');
	    document.getElementById("waiting").style.display = "none";
	    document.getElementById("output").innerHTML = `&nbsp;&nbsp;${i} GDELT Records Processed`;
	})
	.catch(error => {
	    document.getElementById("waiting").style.display = "none";
	    document.getElementById("output").innerHTML = "&nbsp;&nbsp;Error";
        })
    });
}
