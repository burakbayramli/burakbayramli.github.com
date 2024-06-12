
function init() {

    var url = "https://raw.githubusercontent.com/burakbayramli/alldata/main/globe/g10g1";
    
    fetch(url, {
        headers: {
            'content-type': 'multipart/byteranges',
            'range': 'bytes=2-5,10-13',
        },
    }).then(response => {
        if (response.ok) {
	    return response.text();
        }
    }).then(response => {
        console.log(response);
    });
    
}
