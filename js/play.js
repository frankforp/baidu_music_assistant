if (window.playjs) {
    return;
}
window.playjs = true;

var countdownTimer,checkTimer;

function ba_startcountdown() {
    var totalTime = jQuery('.totalTime');
    var time = (totalTime.html());
    var arr = time.split(':');
    var min = parseInt(arr[0]);
    var sec = parseInt(arr[1]);
    var seconds = min * 60 + sec;
    if(window.ba_playtime){
        seconds = parseInt(window.ba_playtime);
    }
    var countdown = seconds + 5;
    nodelog('start countdown : ' + countdown);
    countdownTimer = setTimeout(function() {
        clearList();
        closeWin();
    }, countdown * 1000);
    window.ba_countdown(countdown);
}

function clearList() {
    nodelog('clear playlist.');
    jQuery('.select-all-text').click();
    setTimeout(function() {
        jQuery('.delete-button').click();
    }, 200);
    setTimeout(function() {
        jQuery('.ui-dialog-buttonset').find('.wg-button-inner')[0].click();
    }, 500);
};

window.ba_loaded = function() {
    ba_startcountdown();
    window.nodelog('cookies of play window : ' + document.cookie);
    clearCookie();
    ba_check();
};


function ba_check() {
    if(checkTimer){
        clearTimeout(checkTimer);
    }
    checkTimer = setTimeout(function() {
        if (document.getElementsByClassName('curTime')[0].innerHTML == '00:00') {
            clearList();
            clearTimeout(countdownTimer);
            window.ba_playerr();
        } else {
            window.ba_success();
        }
    }, 5000);

}

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
    for (var i = 0; i < localStorage.length; i++) {
        localStorage.removeItem(localStorage.key(i));
    }
}