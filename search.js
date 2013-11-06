var keyword = '爆发+朱娜';
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

if (!chrome.cookies) {
    // chrome.cookies = chrome.experimental.cookies;
}

function deleteCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    document.cookie = name + "=delete; expires=" + exp.toGMTString();
}

function clearCookie() {
    // chrome.cookies.getAll({}, function(cookies) {
    //     alert(cookies);
    // });
}