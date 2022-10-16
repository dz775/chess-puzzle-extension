chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        const url = request.url;
        if (url){
            fetch(url).then(res => res.json()).then(data => { sendResponse({ response : data.moves[0].uci[0]}) } )
        return true;
        }
    }
)