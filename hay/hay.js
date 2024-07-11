
function fetch_data() {

    url = "/hay/hay.json";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url = url, false ); 
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

function init() {
    hay_data = fetch_data();
    console.log('data loaded');
}

function diagnose() {
    var ailment = document.getElementById("ailment").value;
    console.log(ailment);

    ailment = ailment.toLowerCase();

    var output = "";
    
    Object.keys(hay_data).forEach(function(x) {
	if (x.toLowerCase().includes(ailment) || hay_data[x].toLowerCase().includes(ailment) ) {
	    new_data = hay_data[x];
	    output += "<p>" + x + ":" + new_data + "<p/>";
	}
    });

    document.getElementById("output").innerHTML = output;
    
}
