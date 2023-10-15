
function init() {
    url = "https://raw.githubusercontent.com/burakbayramli/kod/master/travel/urla/index.json";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url = url, false ); 
    xmlHttp.send( null );
    result = xmlHttp.responseText;
    console.log(result);
}

