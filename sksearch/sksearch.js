
async function searchText() {

    var s = document.getElementById("keywords").value;
    s = s.toLowerCase().replace("ç","c").replace("ö","o").replace("ğ","g");
    s = s.replace("ı","i").replace("ü","u").replace("ş","s");
    var stoks = s;    
    var stoks = stoks.split(" ");

    var stok_hits = {}
    
    for (var i=0; i<stoks.length; i++) {
	var tok = stoks[i];
	var letter_dict;
	var firstLetter = tok.substring(0,1);
	var url = `/idx/invidx-${firstLetter}.json`;
	await fetch(url)
	    .then(response => response.json())
	    .then(data => letter_dict = data );
	
	if (letter_dict.hasOwnProperty(tok)) {
	    Object.keys(letter_dict[tok]).forEach(function(article) {
		if (stok_hits.hasOwnProperty(article)) {
		    stok_hits[article] = stok_hits[article] + letter_dict[tok][article];
		} else {
		    stok_hits[article] = letter_dict[tok][article];
		}
	    });	    
	}	
    }

    var keyValues = []

    for (var key in stok_hits) {
	keyValues.push([ key, stok_hits[key] ])
    }

    keyValues.sort(function compare(kv1, kv2) {
	return kv2[1] - kv1[1] 
    })

    N = Math.min(20,keyValues.length);
    var out = ""
    for (var i=0;i<N;i++) {
	out +=
	    '<p><a target="_blank" href="' +
	    'https://burakbayramli.github.io' + keyValues[i][0] + '">' +
	    keyValues[i][0] +
	    '</a></p>';
	
	document.getElementById("output").innerHTML = out;
    }
}
