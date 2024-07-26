
var urls = {
    'SomaFM: Groove Salad':'https://ice4.somafm.com/groovesalad-32-aac',
    'SomaFM: Secret Agent':'https://ice2.somafm.com/secretagent-32-aac',
    '1Mix Radio':'http://fr2.1mix.co.uk:8060/32aac',
    'Radio Paradise':'https://stream-tx3.radioparadise.com/mp3-32',
    'Gold Instrumental':'http://199.233.234.34:25373/stream',
    'SomaFM: Covers':'https://ice4.somafm.com/covers-32-aac',
    'OPB':'http://flume.opb.org/radio_lbr.mp3#MP3#National'
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
