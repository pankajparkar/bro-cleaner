
function getUrl(currentTab) {
    const originRegex = /(^https?:\/\/)[^\/]+/gi;
    const matched = currentTab.url.match(originRegex);
    return matched && matched.length && matched[0];
}

async function runBrowserCleaner(obj) {
    const [currentTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    if (!currentTab) return;
    const currentUrl = getUrl(currentTab);
    await chrome.browsingData.remove({
        "origins": [
            currentUrl
        ]
    }, obj,
        // {
        //     // "cacheStorage": true,
        //     // "cookies": true,
        //     // "fileSystems": true,
        //     // "indexedDB": true,
        //     "localStorage": true,
        //     // "sessionStorage": true,
        //     // "pluginData": true,
        //     // "serviceWorkers": true,
        //     // "webSQL": true
        // }, 
        () => {
            alert(`Cleared site data on ${currentUrl}`);
            // chrome.tabs.reload();
        });
}

const getFormElements = () => {
    return document.querySelector('form[name=browser-cleaner]').elements;
}

async function formSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const [localStorageEl, sessionStorageEl, cacheStorageEl, cookiesEl,] = getFormElements();
    const obj = {
        localStorage: localStorageEl.checked,
        // sessionStorage: sessionStorage.checked,
        cacheStorage: cacheStorageEl.checked,
        cookies: cookiesEl.checked,
    };
    await chrome.storage.local.set(obj);
    await runBrowserCleaner(obj);
}

async function prefillValues() {
    const { localStorage, cacheStorage, cookies } = await chrome.storage.local.get(['localStorage', 'cacheStorage', 'cookies', 'sessionStorage']);
    const [localStorageEl, sessionStorageEl, cacheStorageEl, cookiesEl,] = getFormElements();
    localStorageEl.checked = localStorage || false;
    sessionStorageEl.checked = cacheStorage || false;
    cacheStorageEl.checked = cookies || false;
    cookiesEl.checked = cookies || false;
}

document.addEventListener('DOMContentLoaded', async function () {
    await prefillValues();
    document.querySelector("[name=browser-cleaner]").addEventListener(
        'submit',
        formSubmit
    );
});