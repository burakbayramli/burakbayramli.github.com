var imgs = [];
var offset = 0;
var BATCH = 9;

function translit_tr(text){
    var Maps = {
        "İ":"I","Ş":"S","Ç":"C","Ğ":"G","Ü":"U","Ö":"O",
        "ı":"i","ş":"s","ç":"c","ğ":"g","ü":"u","ö":"o"
    };
    Object.keys(Maps).forEach(function(Old){
        text    = text.replace(Old,Maps[Old]);
    });
    return text;
}

function fetch_album_json() {
    url = "/album/album.json";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url = url, false ); 
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
  
function show_thumb_list() {
    album = JSON.parse(fetch_album_json());
    var keys = Object.keys(album['photos']);
    var N = Math.min(BATCH,imgs.length);
    var out = "";
    out += "<table>";
    var i = offset;
    while (i<offset+N) {
	out += "<tr>";
	for (var j=0;j<3;j++) {
	    if (i<imgs.length) {
		out += "<td>";
		out += "<a target='_blank' href='/album/photo.html?photo=" + imgs[i] + "'>";
		out += "<img src='data:image/png;base64," + album['photos'][imgs[i]]['thumbnail']+"'></img>";
		out += "</a>";
		out += "</td>";
	    }
	    i = i + 1;
	    if (i>=offset+N) break;
	}	
	out += "</tr>";
    }
    out += "</table>";
    document.getElementById('output').innerHTML = out;    
}

function showall() {
    album = JSON.parse(fetch_album_json());
    imgs = Object.keys(album['photos']);
    //console.log(imgs);
    offset = 0;
    show_thumb_list();
    
}

function next() {    
    if ((offset - BATCH) > imgs.length) return;
    offset = offset + BATCH;
    show_thumb_list();
}

function previous() {
    if ((offset - BATCH) < 0) return;
    offset = offset - BATCH;
    show_thumb_list();
}

function person_detail(p) {
    album = JSON.parse(fetch_album_json());
    var s = p + " : ";
    album["people"][p]["stories"].forEach(function(x) {
	s += x + "<br/>";
    });
    document.getElementById('person_detail').innerHTML = s;
}

function photo_details() {
    album = JSON.parse(fetch_album_json());
    var pic = location.search.split('photo=')[1];
    console.log(pic);
    var out = "";
    out += "<img onclick='xy_click(event)' width='500' src='" + album['photos'][pic]['url'] + "'></img>";
    out += "<div><center>" + album['photos'][pic]['desc'] + "</center></div>"; 
    out += "<div><center>Resimdekiler: ";
    ppl = album['photos'][pic]['people'];
    Object.keys(ppl).forEach(function(x) {
	out += `<a href='#' onclick='person_detail("${x}")'>${x}</a>&nbsp;`;
    });
    out += "</center></div>";
    document.getElementById('output').innerHTML = out;
    
}

function xy_click(event) {
    let x = event.clientX;
    let y = event.clientY;
    console.log(x + " " + y);
}


