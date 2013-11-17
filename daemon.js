chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "clearCookie") {
            clearCookie();
        } else if (request.action == 'playend') {
            try{
                sendResponse({});
            }catch(e){}
            chrome.tabs.query({
                title:'working...'
            }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "playend"
                }, function(response) {});
            });
        }
    }
);

function clearCookie() {
    var milliseconds = 1000 * 60 * 60 * 24 * 365;
    var oneYearAgo = (new Date()).getTime() - milliseconds;
    chrome.browsingData.remove({
        "since": oneYearAgo
    }, {
        "cookies": true,
        "localStorage": true
    }, function() {});
}