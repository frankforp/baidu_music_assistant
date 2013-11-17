var keyword = '报告司令+朱娜';
var refreshTime = 5 * 60 * 1000;
if (location.search.indexOf('key=' + encodeURIComponent(keyword)) != -1) {
    setTimeout(function() {
        search(keyword);
    }, refreshTime);
} else {
    search(keyword, true);
}

document.title = 'working...';

jQuery('.list-micon')[0].click();

function search(keyword, refresh) {
    checkIsOnline(function(isOnline) {
        if (isOnline) {
            clearCookie();
            if (refresh) {
                jQuery('#ww').val(keyword);
                jQuery('.s_btn').click();
            } else {
                jQuery.get('/search?key=' + encodeURIComponent(keyword));
                jQuery('.list-micon')[0].click();
            }
        } else {
            setTimeout(function() {
                search(keyword);
            }, 1000);
        }
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "playend"){
            search(keyword);
            sendResponse({});
        }
    }
);

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
    document.cookie = name + "=delete; expires=" + exp.toGMTString() + '; path=/; domain=.baidu.com';
}

function clearCookie() {
    chrome.runtime.sendMessage({
        action: "clearCookie"
    }, function(response) {});
}