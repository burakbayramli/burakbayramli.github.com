
function init() {

    apid = "TlFIUEVOWUY0SzZRTThHUA==";
    z = Math.cos(10); z++; k = atob(apid); y = Math.sin(10)*Math.cos(1);
    var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SPY&apikey=${k}`;

    fetch(url)
	.then(function (response) {
	    if (200 !== response.status) {
		console.log(
		    "Looks like there was a problem. Status Code: " + response.status
		);
		return;
	    }
	    response.json().then(function (data) {
		var xs = []; var ys = [];
		daily = data["Time Series (Daily)"];
		Object.keys(daily).forEach(function(key){
		    x = key + " 17:00:00";
		    xs.push(x);
		    y = parseFloat(daily[key]["4. close"]);
		    ys.push(y);
		})

		out = "";
		last_key = Object.keys(daily)[0];
		out += "Date: " + last_key + "\n";
		out += "Open: " + daily[last_key]["1. open"] + "\n";
		out += "High: " + daily[last_key]["2. high"] + "\n";
		out += "Low: " + daily[last_key]["3. low"] + "\n";
		out += "Close: " + daily[last_key]["4. close"] + "\n";
		out += "Volume: " + daily[last_key]["5. volume"] + "\n";
		
		document.getElementById('close').innerText = out;
		
		TESTER = document.getElementById('graph');
		var layout = {
		    title: { text:'SP 500' }
		};
		Plotly.newPlot( TESTER, [{ x: xs, y: ys }], layout );
	    });
	})
	.catch(function (err) {
	    console.log("Fetch Error :-S", err);
	});


}
