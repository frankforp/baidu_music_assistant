var totalTime = jQuery('.totalTime');
var time = (totalTime.html());
var arr = time.split(':');
var min = parseInt(arr[0]);
var sec = parseInt(arr[1]);
var seconds = min * 60 + sec;

var countdown = seconds + 10;
setTimeout(function() {
    chrome.runtime.sendMessage({
        action: "playend"
    }, function(response) {
        window.close();
    });
}, countdown * 1000);

setInterval(function() {
    countdown--;
    document.title = countdown + '秒后自动关闭';
}, 1000);