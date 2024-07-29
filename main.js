
function init() {
    var rt = localStorage.getItem('reminder_text');
    const date = new Date();
    const d1 = date.getDate();
    const m1 = date.getMonth() + 1;
    const y1 = date.getFullYear();    
    console.log(rt);
    console.log(d1, m1, y1);
    var s = "";
    if (rt != null) {
	rt = JSON.parse(rt);
	Object.keys(rt).forEach(function (x) {
	    var [d2,m2,y2] = rt[x].split("/");
	    rtext = x;
	    if ( (d1==d2 | d2=="*") & (m1==m2|m2=="*") & (y1==y2 | y2=="*") ) {
		s += `<p><font color="red">- ${rtext}</font></p>`;
	    }
	});
    }
    if (s.length > 0) {
	s += '<font size="1.5px"><a href="/static/reminders/index.html">Detail</a></font>';
	document.getElementById('reminder').innerHTML = s;
    }
}

