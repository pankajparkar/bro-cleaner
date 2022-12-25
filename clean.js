
function getUrl(currentTab) {
    const originRegex = /(^https?:\/\/)[^\/]+/gi
    return currentTab.url.match(originRegex)[0];
}

async function runBrowserCleaner() {
    const [currentTab] = chrome.tabs.query({
        active: true,
        currentWindow: true
    });
    if (currentTab === undefned) return;
    const currentUrl = getUrl(currentTab);
    await chrome.browsingData.remove({
        "origins": [
            currentUrl
        ]
    }, {
        // "cacheStorage": true,
        // "cookies": true,
        // "fileSystems": true,
        // "indexedDB": true,
        "localStorage": true,
        // "sessionStorage": true,
        // "pluginData": true,
        // "serviceWorkers": true,
        // "webSQL": true
    }, () => {
        alert(`Cleared site data on ${currentUrl}`);
        // chrome.tabs.reload();
    });
}
console.log('localStorage', localStorage, window.localStorage);

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("run-bro-clean").addEventListener(
        'click',
        runBrowserCleaner
    );
});