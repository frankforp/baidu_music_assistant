var fs = require('fs');
var path = require('path');
var gui = require('nw.gui');
var maxLog = 400;

var logs = [];

var count = 0;

var confPath = './';

var confFile = fs.readFileSync(path.join(confPath, 'config.json'));
var config = JSON.parse(confFile);

global.playtime = 60;
// global.playtime = localStorage.getItem('playtime');

function log(s,classname) {
    classname = classname || 'log';
    var log = '<p class="' + classname + '">[' + (new Date()).toLocaleString() + '] ' + s + '</p>';
    var logElem = document.getElementById('log');
    if (logs.length < maxLog) {
        logs.push(log);
    } else {
        logs.shift();
        logs.push(log);
    }
    logElem.innerHTML = logs.join('');
    var y = 99999;
    window.scrollTo(0, y);
}

global.error = function(s){
    log(s,'error');
}

function attachScript(win, url, callback) {
    var doc = win.document;
    var script = doc.createElement('script');
    if (callback) {
        script.addEventListener('load', callback);
    }
    script.src = url;
    doc.getElementsByTagName('head')[0].appendChild(script);
}

var timer;

function countdown(n) {
    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(function() {
        n--;
        if (n === 0) {
            clearInterval(timer);
            timer = null;
        }
        document.title = '百度音乐助手 - ' + n + '秒后自动播放下一首';
    }, 1000);
}

global.log = log;
global.attachScript = attachScript;
global.countdown = countdown;
global.incCount = function() {
    jQuery('#count').html(++count);
};

var win = gui.Window.get();
win.on('close', function() {
    gui.App.quit();
});

jQuery(function() {

    log('inited.');
    log('cwd : ' + process.execPath);
    log('begin to load search window.');

    jQuery.ajax(path.dirname(location.href + '/index.html'),{
        success:function(data){
            // alert(data)
        }
    });

    var swin = gui.Window.open('http://music.baidu.com/search?key=test', {
        show: false,
        frame: true,
        toolbar: true,
        webkit: {
            plugin: true
        }
    });

    swin.on('loaded', function(e) {
        log('search window loaded.');
        attachScript(swin.window, 'app://baidu_music/js/search.js', function() {
            log('search.js attached');
        });
    });

    jQuery('#showplaywin').on('click', function(e) {
        if (!global.pwin) {
            e.target.checked = false;
            return;
        }
        if (e.target.checked) {
            global.pwin.show();
            global.pwin.focus();
        } else {
            global.pwin.hide();
        }
    });

    jQuery('#state').show();
    jQuery('#time').html(new Date().toLocaleString());
    // jQuery('#state').width(jQuery('#time').width() + 'px');
    jQuery('#count').html(count);
    setInterval(function() {
        jQuery('#time').html(new Date().toLocaleString());
    });
    if(global.playtime){
        jQuery('#playtime').val(global.playtime);
    }
    var setPlaytimeTimer;
    jQuery('#playtime').on('input',function(e){
        if(setPlaytimeTimer){
            clearTimeout(setPlaytimeTimer);
        }
        setPlaytimeTimer = setTimeout(function(){
            global.log('set playtime to ' + e.target.value + ' seconds');
            global.playtime = parseInt(e.target.value);
            localStorage.setItem('playtime',global.playtime);
        },500);
    });
});