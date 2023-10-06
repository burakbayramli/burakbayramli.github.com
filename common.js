
all_apps = ['weather','movies','news'];

expires_path = '; expires=Wed, 05 Aug 2025 23:00:00 UTC;path=/';

function init_cookies() {

    if (document.cookie.length < 1) {
	empty = {}
	all_apps.forEach(function(app) {
	    empty[app] = {};
	})
	document.cookie = 'bb=' + JSON.stringify(empty) + expires_path;
    } else {
	var elems = document.cookie.split("=");
	prefs = JSON.parse(elems[1]);    
	all_apps.forEach(function(app) {
	    if (! prefs.hasOwnProperty(app)) {
		prefs[app] = {}
	    }
	})
	document.cookie = 'bb=' + JSON.stringify(prefs) + expires_path;	
    }
}

function get_prefs() {
    var elems = document.cookie.split("=");
    prefs = JSON.parse(elems[1]);
    return prefs;	
}

function save_cookie(prefs) {
    document.cookie = 'bb=' + JSON.stringify(prefs) + expires_path;
}

