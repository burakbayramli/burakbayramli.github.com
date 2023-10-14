
function init2() {
    const script = document.createElement('script')
    script.src = 'http://tass.com/rss/v2.xml?callback=handleResponse';
    document.body.appendChild(script);
}

function handleResponse(data) {
  console.log(data);
}

function init() {
    url = "https://raw.githubusercontent.com/burakbayramli/kod/master/travel/urla/index.json";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url = url, false ); 
    xmlHttp.send( null );
    result = xmlHttp.responseText;
    console.log(result);
}

