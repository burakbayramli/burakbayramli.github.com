
var urls = {
    'SomaFM: Groove Salad':'https://ice1.somafm.com/groovesalad-32-aac',
    'SomaFM: Secret Agent':'https://ice1.somafm.com/secretagent-32-aac',
    '1Mix Radio':'http://fr2.1mix.co.uk:8060/32aac',
    'Radio Paradise':'https://stream-tx3.radioparadise.com/mp3-32',
    'SomaFM: Covers':'https://ice1.somafm.com/covers-32-aac',
    "Lush": "https://ice1.somafm.com/lush-32-aac",
    "Beat Blender": "https://ice4.somafm.com/beatblender-32-aac",
    'WVIA': 'https://26223.live.streamtheworld.com:443/WVIAFM_SC'
}    


function init() {

    var id = "SomaFM: Groove Salad";
}

function play() {
    var id = document.getElementById("station_id").value;
    var station_url = urls[id];
    
    // Select the existing HTML audio element
    var player = document.getElementById("audio_player");
    
    // Stop current stream, update source, and play programmatically
    player.pause();
    player.src = station_url;
    player.load();
    
    var playPromise = player.play();
    if (playPromise !== undefined) {
        playPromise.catch(function(error) {
            console.error("Browser blocked playback:", error);
        });
    }
}
