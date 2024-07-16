
var stations = [
    'https://somafm.com/groovesalad32.pls',
    'https://somafm.com/secretagent32.pls',
    'http://209.236.126.18:8004/listen.pls',
    'https://laradiofm.com/download/394-en-pls',
    'http://199.233.234.34:25373/listen.pls',
    'https://somafm.com/covers32.pls',
    'http://kcrw.streamguys1.com/kcrw_192k_mp3_news_internet_radio'];

var urls = {
    'SomaFM: Groove Salad':'https://ice4.somafm.com/groovesalad-32-aac',
    'SomaFM: Secret Agent':'https://ice2.somafm.com/secretagent-32-aac',
    'Big Blue Swing':'http://209.236.126.18:8004',
    'Radio Paradise':'https://stream-tx3.radioparadise.com/mp3-32',
    'Gold Instrumental':'http://199.233.234.34:25373/stream',
    'SomaFM: Covers':'https://ice4.somafm.com/covers-32-aac',
    'KCRW':'http://kcrw.streamguys1.com/kcrw_192k_mp3_news_internet_radio'
};

function init() {

    var id = "SomaFM: Groove Salad";
}

function play() {
    var id = document.getElementById("station_id").value;
    console.log(id);
    var station_name = id;
    var station_url = urls[id];
    var out = `<p>${station_name}</p><p><audio controls="controls" src="${station_url}"></audio></p>`;
    document.getElementById("station").innerHTML = out;    
}
