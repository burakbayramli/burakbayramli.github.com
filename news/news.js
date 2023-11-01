
function saveShowHideTextBox(){
    prefs = get_prefs();
    var x = document.getElementById("filter_words");
    if (x.style.display === "none") {
	document.getElementById("filter_words").value = prefs['news']['filter_words'];
        x.style.display = "block";
	document.getElementById("but1").textContent = "Save";
    } else {
	fw = document.getElementById("filter_words").value;
	prefs['news']['filter_words'] = fw;
	save_cookie(prefs);
        x.style.display = "none";
	document.getElementById("but1").textContent = "Set Filter";
    }
    

}

var news_sources = [["Politico","https://www.politico.com/rss/politicopicks.xml"],
		    ["Politico.eu","https://api.allorigins.win/raw?url=https://www.politico.eu/feed/"],
		    ["Arab News","https://www.arabnews.com/cat/3/rss.xml"],
		    ["TDB","https://api.allorigins.win/raw?url=https://feeds.thedailybeast.com/summary/rss/articles"],
		    ["CNBC","https://www.cnbc.com/id/100727362/device/rss/rss.html"],
		    ["NYT", "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"],
		    ["Al Monitor", "https://api.allorigins.win/raw?url=https://www.al-monitor.com/rss"],
		    ["First Post","https://www.firstpost.com/rss/world.xml"],
		    ["Janes","https://api.allorigins.win/raw?url=https://www.janes.com/feeds/news"],
		    ["Hindustan Times World","https://api.allorigins.win/raw?url=https://www.hindustantimes.com/feeds/rss/world-news/rssfeed.xml"],
		    ["WION","https://api.allorigins.win/raw?url=https://www.wionews.com/feeds/world/rss.xml"],
		    ['FuelCellsWorks','https://fuelcellsworks.com/feed/']
		   ];
		    
function get_news() {
    // based on https://github.com/pokiiio/hatena-blog-parser
    prefs = get_prefs();
    if (prefs['news']['filter_words'] == null) {
	prefs['news']['filter_words'] = "xxyxyxyyxyx";
    }
    skip_words = prefs['news']['filter_words'].split(",");
    
    out = "";
    news_sources.forEach(function(elem) {
	out += `<h3>${elem[0]}</h3>`;
	console.log(elem[0],elem[1]);
	url = elem[1];
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", url = url, false ); 
	xmlHttp.send( null );
	result = xmlHttp.responseText;
	const blogTitle = result.split('<title>')[1].split('</title>')[0];
	const blogDescription = result.split('<description>')[1].split('</description>')[0];
	let data = [];
	var elements = result.split('<item>');
	for (var i=1;i<Math.min(elements.length,8);i++) {
	    try {
		var element = elements[i];
		var postTitle = element.split('<title>')[1].split('</title>')[0];
		var postLink = element.split('<link>')[1].split('</link>')[0];
		var postDescr = element.split('<description>')[1].split('</description>')[0];
		postTitle = postTitle.replace("<![CDATA[","");
		postTitle = postTitle.replace("]]>","");
		postDescr = postDescr.replace("<![CDATA[","");
		postDescr = postDescr.replace("]]>","");
		postDescr = postDescr.replace("Read more at The Daily Beast","");
		postLink = postLink.replace("<![CDATA[","");
		postLink = postLink.replace("]]>","");
		const regex = /<img .*?>/i;
		postDescr = postDescr.replace(regex, '');
		
		let skip = false;
		skip_words.forEach(function(word) {
		    if (postDescr.includes(word) || postTitle.includes(word)) {
			skip = true;
		    }
		})
		if (! skip) {
		    out += `<p><a href="${postLink}" target="_blank">${postTitle}</a><br/><br/>${postDescr}</p>`;
		}
	    } catch (Exception) {
		console.log("Error");
	    }
	}

    });
    document.getElementById("news").innerHTML = out;
}

function process_news() {

    document.getElementById("processing").style.display = "block";
    new Promise(resolve => setTimeout(() => {
        resolve(get_news())
    })).then((result) => {
	document.getElementById("processing").style.display = "none";
    });
    
}
		    
function init() {
    init_cookies();     
    document.getElementById("processing").style.display = "none";
    prefs = get_prefs();
    if ( ! prefs['news'].hasOwnProperty("filter_words") ) {
	prefs['news']['filter_words'] = "example1,example2";
    }
}


