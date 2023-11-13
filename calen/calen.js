
function init() {
    out = "";
    out += "<br/>";
    out += "<br/>";
    out += "Your current timezone: " + Intl.DateTimeFormat().resolvedOptions().timeZone;
    c = "de-DE";
    
    out += "<br/>";
    out += "<br/>";
    out += "Local Time";
    out += "<br/>";
    out += "<br/>";
    out +=  new Date().toLocaleDateString(c) + " ";
    out +=  new Date().toLocaleTimeString(c);
    
    out += "<br/>";
    out += "<br/>";
    out += "New York";
    out += "<br/>";
    out += "<br/>";
    const ny = new Date().toLocaleString(c, {timeZone: "America/New_York"});
    out += ny;
    
    out += "<br/>";
    out += "<br/>";
    out += "Los Angeles";
    out += "<br/>";
    out += "<br/>";
    const la = new Date().toLocaleString(c, {timeZone: "America/Los_Angeles"});
    out += la;
    
    document.getElementById('output').innerHTML = out;

    
}
