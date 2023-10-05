

function imp() {
    prefs = get_prefs();
    new_picks = JSON.parse(document.getElementById("myTextarea").value);    
    set_cookie(new_picks);
    alert('done');
}

function init() {
    prefs = get_prefs();    
    BUTTONDOWNLOAD.onclick = (function(){
	let j = document.createElement("a")
	j.download = "bb_"+Date.now()+".json"
	j.href = URL.createObjectURL(new Blob([JSON.stringify(prefs, null, 2)]))
	j.click()
    })

}
