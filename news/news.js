
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


var news_sources = [["First Post","https://www.firstpost.com/rss/world.xml"],
		    ["Politico","https://www.politico.com/rss/politicopicks.xml"],
		    ["Politico.eu","https://corsproxy.io/?https://www.politico.eu/feed/"],
		    ["Arab News","https://www.arabnews.com/cat/3/rss.xml"],
		    ["TDB","https://corsproxy.io/?https://feeds.thedailybeast.com/summary/rss/articles"],
		    ["CNBC","https://www.cnbc.com/id/100727362/device/rss/rss.html"],
		    ["NYT", "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"],
		    ["Al Monitor", "https://corsproxy.io/?https://www.al-monitor.com/rss"],
		    ["Janes","https://corsproxy.io/?https://www.janes.com/feeds/news"],
		    ["Hindustan Times World","https://corsproxy.io/?https://www.hindustantimes.com/feeds/rss/world-news/rssfeed.xml"],
		    ["WION","https://corsproxy.io/?https://www.wionews.com/feeds/world/rss.xml"],
		    ['FuelCellsWorks','https://fuelcellsworks.com/feed/']
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
	});

    })
    document.getElementById("processing").style.display = "none";
    document.getElementById("news").innerHTML = out;
}

function init() {
    init_cookies();     
    prefs = get_prefs();
    console.log(prefs);
    if ( ! prefs['news'].hasOwnProperty("filter_words") ) {
	prefs['news']['filter_words'] = "example1,example2";
    }
    document.getElementById("processing").style.display = "block";
    visit();
}
