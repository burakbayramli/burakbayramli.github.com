
function fetch_data() {

    url = "/reading/data-19000101.json";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url = url, false ); 
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

function fetch_docs() {

    url = "/reading/spildocs.json";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url = url, false ); 
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

function spildoc_tr() {
    docs = fetch_docs();
    url = docs['tr'][spiller];
    window.open(url, '_blank');
}

function spildoc_en() {
    docs = fetch_docs();
    url = docs['en'][spiller];
    window.open(url, '_blank');
}

function mildoc() {
    url = `details/millman/${mil1}.txt`;
    window.open(url, '_blank');
}

function get_data(birth_date) {

    data = fetch_data();
    
    const dt1 = new Date("1900-01-01");

    diff = birth_date.getTime() - dt1.getTime();

    step = diff / (1000*60*60*24);

    return data[step];
}

function calculate_cycle(birth_date) {

    res = get_data(birth_date)

    var now_year = String(new Date().getFullYear());

    mon = String(birth_date.getMonth()+1);

    if (mon.length == 1) { mon = "0" + mon; }

    day = String(birth_date.getDate());

    if (day.length == 1) { day = "0" + day; }

    dt = new Date(now_year + "-" + mon + "-" + day)

    res = get_data(dt);

    res = String(res[2][0]);
        
    total = 0;
    if (res.length == 2) {
	total = parseInt(res[0]) + parseInt(res[1]);
    } else {
	total = parseInt(res[0]);
    }
    if (total > 9) {
	res = String(total);
	total = parseInt(res[0]) + parseInt(res[1]) 
    }

    return total;
}

function calculate() {

    var day = document.getElementById("day").value;
    var mon = document.getElementById("mon").value;
    var year = document.getElementById("year").value;

    var base_url = "https://burakbayramli.github.io/reading";
    copy_links = "";
    
    const birth_date = new Date(year + "-" + mon + "-" + day);
    console.log(birth_date);
    res = get_data(birth_date);

    spiller = res[0]; // global variable
    
    if (year == "1973") {
	spiller = "Gemini"
    }
    out = "";
    out += `<p>Spiller</p>`;
    out += `<p><a href="details/spiller/${spiller}.html" target="_blank">${spiller}</a></p>`;
    copy_links += `${base_url}/details/spiller/${spiller}.html\n`;
    
    out += `<p>Chinese</p>`;
    out += `<p><a href="details/chinese/${res[1]}.html" target="_blank">${res[1]}</a></p>`;
    copy_links += `${base_url}/details/chinese/${res[1]}.html\n`;

    mil1 = String(res[2][0]) + String(res[2][1]);
    
    out += `<p>Lewi</p>`;
    for (var i=0;i<res[3].length;i++) {
	var lewi = res[3][i];
	out += `<a href="details/lewi/${lewi}.html" target="_blank">${lewi}</a>&nbsp;&nbsp;`;
	copy_links += `${base_url}/details/lewi/${lewi}.html\n`;
    }
    out += "</p>";

    out += `<p>Day of Month</p>`;
    var day_total = parseInt(day[0]) + parseInt(day[1])
    out += `<a href="details/daymon/path-${day_total}.txt" target="_blank">${day_total}</a>&nbsp;&nbsp;`;
    copy_links += `${base_url}/details/daymon/path-${day_total}.txt\n`;
       
    out += `<p>Millman</p>`;
    out += `<p><a href="details/millman/${mil1}.html" target="_blank">${mil1}</a>&nbsp;&nbsp;`;
    copy_links += `${base_url}/details/millman/${mil1}.html\n`;

    for (var i=2;i<res[2].length;i++) {
	var mil2 = res[2][i];
	out += `<a href="details/millman/${mil2}.html" target="_blank">${mil2}</a>&nbsp;&nbsp;`;
	copy_links += `${base_url}/details/millman/${mil2}.html\n`;
    }
    out += "</p>";

    out += "<p>Cycle</p>";
    var c = calculate_cycle(birth_date);
    out += `<p><a href="details/millman/nineyearcycle.html" target="_blank">${c}</a></p>`;
    
    document.getElementById("output").innerHTML = out;
    document.getElementById("urls").innerText = copy_links;
    document.getElementById('copy_btn').style.display = "block";
    
}

function init() {
    document.getElementById('urls').style.display = "none";
    document.getElementById('copy_btn').style.display = "none";
}

function show_urls() {
    document.getElementById('urls').style.display = "block";
}

