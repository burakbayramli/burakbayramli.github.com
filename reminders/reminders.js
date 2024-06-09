
function init() {
    var rt = localStorage.getItem("reminder_text");
    console.log(rt);
    document.getElementById('reminder_input').innerText =  rt;
}

function save() {
    var rt = document.getElementById('reminder_input').value;
    localStorage.setItem("reminder_text", rt);
}

