
function saveShowHideTextBox(){
    prefs = get_prefs();
    console.log(prefs['news']['filter_words']);
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

//		    ["H2 Central","https://hydrogen-central.com/feed"],
//		    ["Politico.eu","https://www.politico.eu/feed/"],
//		    ["France 24","https://www.france24.com/en/rss"],
//		    ["TDB","https://feeds.thedailybeast.com/summary/rss/articles"],
//		    ["The Atlantic", "https://www.theatlantic.com/feed/all"],
//		    ["Informed Comment","https://www.juancole.com/feed"],
//		    ["Independent, The", "http://www.independent.co.uk/news/world/rss"],
//		    ["The Guardian","http://www.theguardian.com/world/rss"],
//		    ["Al Monitor","https://www.al-monitor.com/rss"],
//		    ["TASS","http://tass.com/rss/v2.xml"],
//		    ["Jane's Defence", "https://www.janes.com/feeds/news"],
//		    ["Japan Times","https://www.japantimes.co.jp/feed/"],
//		    ["WSJ","https://feeds.a.dj.com/rss/RSSOpinion.xml"],
//		    ["WION","https://www.wionews.com/feeds/world/rss.xml"],
//		    ["Hindustan Times World","https://www.hindustantimes.com/feeds/rss/world-news/rssfeed.xml"],

var news_sources = [["First Post","https://www.firstpost.com/rss/world.xml"],
		    ["Politico","https://www.politico.com/rss/politicopicks.xml"],
		    ["Arab News","https://www.arabnews.com/cat/3/rss.xml"],
		    ["Fox News","http://feeds.foxnews.com/foxnews/science"],
		    ['UN News','https://news.un.org/feed/subscribe/en/news/all/rss.xml'],
		    ["CNBC","https://www.cnbc.com/id/100727362/device/rss/rss.html"],
		    ["NYT", "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"]
		   ];

		    

//var skip_words = ['Trump','South'];
//var skip_words = [];

function visit() {
    // based on https://github.com/pokiiio/hatena-blog-parser
    prefs = get_prefs();
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
	result.split('<item>').forEach(element => {
	    try {
		var postTitle = element.split('<title>')[1].split('</title>')[0];
		var postLink = element.split('<link>')[1].split('</link>')[0];
		var postDescr = element.split('<description>')[1].split('</description>')[0];
		postTitle = postTitle.replace("<![CDATA[","");
		postTitle = postTitle.replace("]]>","");
		postDescr = postDescr.replace("<![CDATA[","");
		postDescr = postDescr.replace("]]>","");
		let skip = false;
		skip_words.forEach(function(word) {
		    if (postDescr.includes(word) || postTitle.includes(word)) {
			skip = true;
		    }
		})
		if (! skip) {
		    out += `<p><a href="${postLink}">${postTitle}</a><br/><br/>${postDescr}</p>`;
		}
	    } catch (Exception) {
		console.log("Error");
	    }

    })
    document.getElementById("news").innerHTML = out;
}

function init() {
    init_cookies();     
    prefs = get_prefs();
    console.log(prefs);
    if ( ! prefs['news'].hasOwnProperty("filter_words") ) {
	prefs['news']['filter_words'] = "example1,example2";
    }
    visit();
}
