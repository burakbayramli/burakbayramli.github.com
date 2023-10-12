
function fetch_data() {

    url = "/prof/data-19000101.json";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url = url, false ); 
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

function fetch_docs() {

    url = "/prof/spildocs.json";
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

    var base_url = "https://burakbayramli.github.io/prof";
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
    out += `<p><a href="details/spiller/${spiller}.html">${spiller}</a></p>`;
    copy_links += `${base_url}/details/spiller/${spiller}.html\n`;
    
    out += `<p>Chinese</p>`;
    out += `<p><a href="details/chinese/${res[1]}.html">${res[1]}</a></p>`;
    copy_links += `${base_url}/details/chinese/${res[1]}.html\n`;

    mil1 = String(res[2][0]) + String(res[2][1]);
    
    out += `<p>Lewi</p>`;
    for (var i=0;i<res[3].length;i++) {
	var lewi = res[3][i];
	out += `<a href="details/lewi/${lewi}.html">${lewi}</a>&nbsp;&nbsp;`;
	copy_links += `${base_url}/details/lewi/${lewi}.html\n`;
    }
    out += "</p>";

    out += `<p>Millman</p>`;
    out += `<p><a href="details/millman/${mil1}.html">${mil1}</a>&nbsp;&nbsp;`;
    copy_links += `${base_url}/details/millman/${mil1}.html\n`;

    for (var i=2;i<res[2].length;i++) {
	var mil2 = res[2][i];
	out += `<a href="details/millman/${mil2}.html">${mil2}</a>&nbsp;&nbsp;`;
	copy_links += `${base_url}/details/millman/${mil2}.html\n`;
    }
    out += "</p>";

    out += "<p>Cycle</p>";
    var c = calculate_cycle(birth_date);
    out += `<p><a href="details/millman/nineyearcycle.html">${c}</a></p>`;
    
    document.getElementById("output").innerHTML = out;
    document.getElementById("urls").innerText = copy_links;
    document.getElementById('copy_btn').style.display = "block";
    
}

function init() {
    document.getElementById('copy_btn').style.display = "none";
    document.getElementById('urls').style.display = "none";
}

function show_urls() {
    document.getElementById('urls').style.display = "block";
}

function calculate_mbti(input) { 
    var mbti = "";
    var res = [];
    for (var i=0;i<7;i++){
        var s = 0;
        for (var j=0;j<10;j++){
            s = s + input[(j*7)+i];
        }
        res.push(s);
    }
    
    ei = res[0];
    if (ei<0) mbti = mbti + "E";
    else mbti = mbti + "I";

    sn = res[1]+res[2];
    if (sn<0) mbti = mbti + "S";
    else mbti = mbti + "N";

    tf = res[3]+res[4];
    if (tf<0) mbti = mbti + "T";
    else mbti = mbti + "F";

    jp = res[5]+res[6];
    if (jp<0) mbti = mbti + "J";
    else mbti = mbti + "P";
    
    return mbti;
}

function evaluate_mbti() {
    for (var i=0;i<70;i++){
        var j = i+1;
        res = $("input[name='group"+j+"']:checked").val();
        if (res == undefined) {
            $('#mbtierror').html("Question " + j + " not answered");
            return;
        }
    }    
    var list = [];
    for (var i=0;i<70;i++){
        var j = i+1;
        res = $("input[name=group"+j+"]:checked").val();
        list.push(parseFloat(res));
    }  
    mb = calculate_mbti(list);
    document.getElementById('mbtires').innerHTML = mb;
}

