chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === "updateIcon") {
        console.log(msg);
        chrome.browserAction.setIcon({path: msg.value});
    }
});