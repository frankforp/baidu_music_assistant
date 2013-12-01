if (window.searchjs) {
    return;
}
window.searchjs = true;
var keyword = '恋爱大联盟+朱娜';
try{
    var path = require('path');
}
catch(e){
    global.error('可能受到百度防护机制的限制，请更换ip后重启本软件。');
    return;
}
var fs = require('fs');
var configPath = path.join(path.dirname(process.execPath), 'baconf.json');
var config;
if (fs.existsSync(configPath)) {
    try{
        config = JSON.parse(fs.readFileSync(configPath));    
    }
    catch(e){
        alert(e.message);
    }
    keyword = config.keyword;
}

var gui = require('nw.gui');
var pwin;
var origin_open;

if (location.search.indexOf('key=' + encodeURIComponent(keyword)) != -1) {
    global.log('in search result window.');
    origin_open = window.open;

    window.open = function(url) {
        if (pwin) return;
        global.log('openning : ' + url);
        pwin = gui.Window.open(url, {
            webkit: {
                plugin: true
            },
            show: false,
            frame: false,
            toolbar: false
        });
        global.pwin = pwin;
        pwin.on('loaded', function() {
            if (!pwin) return;
            if (pwin.loaded) return;
            pwin.loaded = true;
            global.log('play window loaded.');
            global.attachScript(pwin.window, 'app://baidu_music/js/play.js', function() {
                global.log('play.js attached.');
                pwin.window.ba_loaded();
            });
            pwin.window.closeWin = function() {
                // pwin.close();
                global.log('start to next search : ' + keyword);
                search(keyword);
                pwin.window.ba_loaded();
            };
            pwin.window.nodelog = global.log;
            pwin.window.ba_countdown = global.countdown;
            pwin.window.ba_playtime = global.playtime;
            pwin.window.ba_playerr = function() {
                global.log('play error.');
                // pwin.close();
                global.log('retry play.');
                search(keyword);
                pwin.window.ba_loaded();
            };
            pwin.window.ba_success = function() {
                global.incCount();
            };
            pwin.on('closed', function() {
                gui.App.quit();
            });
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

var subSWin;

function search(keyword, refresh) {
    global.log('current keyword is : ' + keyword);
    checkIsOnline(function(isOnline) {
        if (isOnline) {
            global.log('cookies of search window : ' + document.cookie);
            clearCookie();
            if (refresh) {
                jQuery('#ww').val(keyword);
                jQuery('.s_btn').click();

            } else {
                // jQuery.get('/search?key=' + encodeURIComponent(keyword));
                jQuery('.list-micon')[0].click();
                if (pwin) {
                    pwin.window.ba_playtime = global.playtime;
                }
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
    for (var i = 0; i < localStorage.length; i++) {
        localStorage.removeItem(localStorage.key(i));
    }
}