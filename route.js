alert(2)
var disconn = jQuery('[name=Disconnect]');
var conn = jQuery('[name=Connect]');
var stat = jQuery('#linkStat');
var time = 5 * 10 * 60;
alert(stat.html())
if(stat.html() === '已连接'){
    setTimeout(function(){
        offline();
    },time);
}

if(conn[0].disabled === false){
    conn.click();
}

function offline(){
    disconn.click();
}