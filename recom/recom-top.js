
function fetch_means_data() {

    url = "/recom/means.json";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url = url, false ); 
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function fetch_title_id_data() {

    url = "/recom/movie_title_int.json";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url = url, false ); 
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function fetch_id_title_rev_data() {

    url = "/recom/movie_id_int_rev.json";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url = url, false ); 
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function fetch_cluster_ids(cluster) {

    url = "/recom/cluster_members_" + cluster + ".json";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url = url, false ); 
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
}

function sfc32(a, b, c, d) {
    return function() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
      var t = (a + b) | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      d = d + 1 | 0;
      t = t + d | 0;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
}

function closest_cluster(picks, means, title_id) {
    K = Object.keys(means).length;
    dist = [];
    for (let i = 0; i < K; i++) {
	dist_k = 0;
	Object.keys(picks).forEach(function(key) {
	    if (picks[key] > 0 && title_id.hasOwnProperty(key)) {
		dist_k += (picks[key] - means[i][title_id[key]])**2;
	    }
	})
	dist.push(Math.sqrt(dist_k));
    }

    const index = dist.indexOf(Math.min(...dist))
    console.log("Closest " + dist);
    console.log("Closest " + index);
    return index;
}

function show_picks() {
    if (document.cookie.length < 1) {
	empty = {"movies": {}}
	document.cookie = JSON.stringify(empty);
    }
    
    cook = JSON.parse(document.cookie);
    out = "";
    out += "<h5>Picks</h5>"
    Object.keys(cook['movies']).forEach(function(key) {
	out += "<p class='remove'><a href=''>" + key + `</a><a onclick='remove("${key}")' href='#'>Remove</a></p>`
    })      
    document.getElementById("picks").innerHTML = out;

    BUTTONDOWNLOAD.onclick = (function(){
	let j = document.createElement("a")
	j.download = "bb_"+Date.now()+".json"
	j.href = URL.createObjectURL(new Blob([JSON.stringify(cook, null, 2)]))
	j.click()
    })
    
}

function remove(movie) {
    cook = JSON.parse(document.cookie);
    delete cook['movies'][movie];
    document.cookie = JSON.stringify(cook);
    show_picks();
}

function add_movie() {
    mov = document.getElementById("myInput").value;
    rat = document.getElementById("myRating").value;
    cook = JSON.parse(document.cookie);
    cook['movies'][mov] = rat;
    document.cookie = JSON.stringify(cook);
}


// Sample with replacement from list, N many items, seed can be
// any string
function sample_wr(sample_from, seed, N) {
    var bucket = [];
    for (var i=0;i<=sample_from.length;i++) {
	bucket.push(i);
    }
    var seed = cyrb128(seed);
    var rand = sfc32(seed[0], seed[1], seed[2], seed[3]);
    var res = [];
    for (var i=0;i<N;i++){
	var randomIndex = Math.floor(rand()*bucket.length);
	idx = bucket.splice(randomIndex, 1)[0];
	res.push(sample_from[idx]);
    }
    return res;
}

function paged_results(page, N) {
    picks = JSON.parse(document.cookie)['movies'];
    means = JSON.parse(fetch_means_data());
    title_id = JSON.parse(fetch_title_id_data());
    rev = JSON.parse(fetch_id_title_rev_data());
    ci = closest_cluster(picks, means, title_id);
    cids = JSON.parse(fetch_cluster_ids(ci));
    sample = sample_wr(cids, JSON.stringify(picks), (page+1)*N);
    return sample.slice(-N);
}

function recommend(page) {
    picks = JSON.parse(document.cookie)['movies'];
    recom_tmp = paged_results(page, 10);
    var recom = [];
    recom_tmp.forEach(function(key) {
	if (!picks.hasOwnProperty(rev[key])) recom.push(key);
    })
    out = ""
    out += "<h5>Recommendations</h5>"
    for (var i=0;i<recom.length;i++){
	var m = rev[recom[i]];
	out += `<a target='_blank' href='http://www.google.com/search?q=${m}'>${m}</a><br/><br/>`
    }
    next = page + 1;
    out += `<br/><a href='#' onclick='recommend(${next})'>Next >></a><br/><br/>`;
    
    document.getElementById("recommendations").innerHTML = out;
}



