var disconn = jQuery('[name=Disconnect]');
var conn = jQuery('[name=Connect]');
var stat = jQuery('#linkStat');

var time = 3 * 1000 * 60;

setTimeout(function run(){
    offline();
    (function wait(){
        checkIsOnline(function(isOnline){
            if(!isOnline){
                online();
                setTimeout(run,time);
            }
            else{
                run();
            }
        });
    })();
},time);

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

function offline(){
    //释放ip
    jQuery.get('/userRpm/WanDynamicIpCfgRpm.htm?wantype=0&ReleaseIp=%CA%CD+%B7%C5&mtu=1500&hostName=TL-WDR4310_TL-WDR4320&downBandwidth=100000&upBandwidth=100000');
    //pppoe断线
    jQuery.get('/userRpm/PPPoECfgRpm.htm?wan=0&wantype=2&acc=500000037760&psw=r4v3p7q7&confirm=r4v3p7q7&specialDial=0&SecType=0&sta_ip=0.0.0.0&sta_mask=0.0.0.0&linktype=2&Disconnect=%B6%CF+%CF%DF');
}

function online(){
    //更新ip
    jQuery.get('/userRpm/WanDynamicIpCfgRpm.htm?wantype=0&RenewIp=%B8%FC+%D0%C2&mtu=1500&hostName=TL-WDR4310_TL-WDR4320&downBandwidth=100000&upBandwidth=100000');
    //pppoe连接
    jQuery.get('/userRpm/PPPoECfgRpm.htm?wan=0&wantype=2&acc=500000037760&psw=r4v3p7q7&confirm=r4v3p7q7&specialDial=0&SecType=0&sta_ip=0.0.0.0&sta_mask=0.0.0.0&linktype=2&Connect=%C1%AC+%BD%D3');
}