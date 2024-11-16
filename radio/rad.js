
var urls = {
    'SomaFM: Groove Salad':'https://ice4.somafm.com/groovesalad-32-aac',
    'SomaFM: Secret Agent':'https://ice2.somafm.com/secretagent-32-aac',
    '1Mix Radio':'http://fr2.1mix.co.uk:8060/32aac',
    'Radio Paradise':'https://stream-tx3.radioparadise.com/mp3-32',
    'SomaFM: Covers':'https://ice4.somafm.com/covers-32-aac',
    "Lush": "https://ice2.somafm.com/lush-32-aac",
    "Beat Blender": "https://ice4.somafm.com/beatblender-32-aac",
    'WVIA': 'https://26223.live.streamtheworld.com:443/WVIAFM_SC'
}    


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
