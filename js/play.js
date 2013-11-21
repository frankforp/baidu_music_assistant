if(window.playjs){
    return;
}
window.playjs = true;

window.iknowloaded = function(){
    window.ba_countdown(countdown);
    window.nodelog('cookies of play window : ' + document.cookie);
    clearCookie();
    window.stopTimer();
};

var totalTime = jQuery('.totalTime');
var time = (totalTime.html());
var arr = time.split(':');
var min = parseInt(arr[0]);
var sec = parseInt(arr[1]);
var seconds = min * 60 + sec;

var countdown = seconds + 10;
setTimeout(function() {
    closeWin();
}, countdown * 1000);

setInterval(function() {
    countdown--;
    document.title = countdown + '秒后自动关闭';
}, 1000);

setTimeout(function(){
    if(document.getElementsByClassName('curTime')[0].innerHTML == '00:00'){
        window.ba_playerr();
    }
    else{
        window.ba_success();
    }
},5000);

function deleteCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    document.cookie = name + "=delete; expires=" + exp.toGMTString() + '; path=/; domain=play.baidu.com';
    document.cookie = name + "=delete; expires=" + exp.toGMTString() + '; path=/; domain=.baidu.com';
}

function clearCookie() {
    var temp = document.cookie.split(";");
    var loop;
    var ts;
    for (loop = 0; loop < temp.length; loop++) {
        ts = temp[loop].split("=")[0];
        deleteCookie(ts);
    }
    for(var i = 0; i < localStorage.length; i++){
        localStorage.removeItem(localStorage.key(i));
    }
}