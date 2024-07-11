function calculate_mbti(input) { 
    var mbti = "";
    var res = [];
    for (var i=0;i<7;i++){
        var s = 0;
        for (var j=0;j<10;j++){
            s = s + input[(j*7)+i];
        }
        res.push(s);
    }
    
    ei = res[0];
    if (ei<0) mbti = mbti + "E";
    else mbti = mbti + "I";

    sn = res[1]+res[2];
    if (sn<0) mbti = mbti + "S";
    else mbti = mbti + "N";

    tf = res[3]+res[4];
    if (tf<0) mbti = mbti + "T";
    else mbti = mbti + "F";

    jp = res[5]+res[6];
    if (jp<0) mbti = mbti + "J";
    else mbti = mbti + "P";
    
    return mbti;
}

function evaluate_mbti() {
    for (var i=0;i<70;i++){
        var j = i+1;
        res = $("input[name='group"+j+"']:checked").val();
        if (res == undefined) {
            $('#mbtierror').html("Question " + j + " not answered");
            return;
        }
    }    
    var list = [];
    for (var i=0;i<70;i++){
        var j = i+1;
        res = $("input[name=group"+j+"]:checked").val();
        list.push(parseFloat(res));
    }  
    mb = calculate_mbti(list);
    document.getElementById('mbtires').innerHTML = mb;
}

