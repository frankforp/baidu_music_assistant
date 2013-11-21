if(window.searchjs){
    return;
}
window.searchjs = true;
var keyword = '伤心海+朱娜';

var gui = require('nw.gui');
var pwin;

if (location.search.indexOf('key=' + encodeURIComponent(keyword)) != -1) {
    global.log('in search result window.');
    var origin_open = window.open;
    window.open = function(url){
        if(pwin) return;
        global.log('openning : ' + url);
        pwin = gui.Window.open(url,{
            webkit:{plugin:true},
            show:false,
            frame:false,
            toolbar:false
        });
        global.pwin = pwin;
        var retryTimer = setTimeout(function(){
            pwin.close();
            global.log('retry after 10 seconds.');
            pwin = null;
            global.pwin = null;
            window.open(url);
        },10000);
        pwin.on('loaded',function(){
            if(!pwin) return;
            if(pwin.loaded) return;
            pwin.loaded = true;
            global.log('play window loaded.');
            global.attachScript(pwin.window,'app://baidu_music/js/jQuery2.0.3.js',function(){
                global.attachScript(pwin.window,'app://baidu_music/js/play.js',function(){
                    global.log('play.js attached.');
                    pwin.window.iknowloaded();
                });
            });
            pwin.window.closeWin = function(){
                pwin.close();
            };
            pwin.window.nodelog = global.log;
            pwin.window.ba_countdown = global.countdown;
            pwin.window.ba_playerr = function(){
                global.log('play error.');
                pwin.close();
                global.log('retry play.');
                window.open(url);
            };
            pwin.window.ba_success = function(){
                global.incCount();
            };
            pwin.window.stopTimer = function(){
                clearTimeout(retryTimer);
            };
        });
        pwin.on('closed',function(){
            pwin = null;
            global.pwin = null;
            global.log('play window closed.');
            global.log('start to next search : ' + keyword);
            search(keyword);
        });

        // window.top.setPlaySrc(url);
    };
    jQuery('.list-micon')[0].click();
} else {
    global.log('begin to search : ' + keyword);
    search(keyword, true);
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
        }, 1000);
    });
    ajax.fail(function() {
        fn(false);
    });
}

function search(keyword, refresh) {
    checkIsOnline(function(isOnline) {
        if (isOnline) {
            global.log('cookies of search window : ' + document.cookie);
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

function deleteCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    document.cookie = name + "=delete; expires=" + exp.toGMTString() + '; path=/; domain=.baidu.com';
    document.cookie = name + "=delete; expires=" + exp.toGMTString() + '; path=/; domain=music.baidu.com';
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