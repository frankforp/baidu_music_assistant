var keyword = '九百九十九朵玫瑰';
var refreshTime = 3 * 60 * 1000;
if (location.search.indexOf('key=' + encodeURIComponent(keyword)) != -1) {
    setTimeout(function() {
        search(keyword);
    }, refreshTime);
} else {
    search(keyword);
}

document.title = 'working...';
clearCookie();
jQuery('.list-micon')[0].click();

function search(keyword) {
    checkIsOnline(function(isOnline) {
        if (isOnline) {
            jQuery('#ww').val(keyword);
            jQuery('.s_btn').click();
        } else {
            setTimeout(function() {
                search(keyword);
            }, 1000);
        }
    });
}

function checkIsOnline(fn) {
    var ajax = jQuery.get('http://music.baidu.com/?' + Date.now(), function(data) {
        setTimeout(function() {
            ajax = jQuery.get('http://music.baidu.com/?' + Date.now(), function(data) {
                fn(true);
            });
            ajax.fail(function() {
                fn(false);
            });
        }, 10000);
    });
    ajax.fail(function() {
        fn(false);
    });
}

function deleteCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    document.cookie = name + "=delete; expires=" + exp.toGMTString();
}

function clearCookie() {
    var temp = document.cookie.split(";");
    var loop;
    var ts;
    for (loop = 0; loop < temp.length; loop++) {
        ts = temp[loop].split("=")[0];
        deleteCookie(ts);
    }
}