function runBrowserCleaner() {
    chrome.storage.local.clear(function () {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        } else {
            console.log('Local Storage is cleaned');
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    debugger;
    document.getElementById("run-bro-clean").addEventListener(
        'click',
        runBrowserCleaner
    );
});