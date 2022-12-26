
function getUrl(currentTab) {
    const originRegex = /(^https?:\/\/)[^\/]+/gi;
    const matched = currentTab.url.match(originRegex);
    return matched && matched.length && matched[0] || '';
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
        // "fileSystems": true,
        // "indexedDB": true,
        // "pluginData": true,
        // "serviceWorkers": true,
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
    const [localStorageEl, webSQLEl, cacheStorageEl, cookiesEl,] = getFormElements();
    const obj = {
        localStorage: localStorageEl.checked,
        webSQL: webSQLEl.checked,
        cacheStorage: cacheStorageEl.checked,
        cookies: cookiesEl.checked,
    };
    await chrome.storage.local.set(obj);
    await runBrowserCleaner(obj);
}

async function prefillValues() {
    const { localStorage, webSQL, cacheStorage, cookies } = await chrome.storage.local.get(['localStorage', 'cacheStorage', 'cookies', 'sessionStorage']);
    const [localStorageEl, webSQLEl, cacheStorageEl, cookiesEl,] = getFormElements();
    localStorageEl.checked = localStorage || false;
    webSQLEl.checked = webSQL || false;
    cacheStorageEl.checked = cacheStorage || false;
    cookiesEl.checked = cookies || false;
}

document.addEventListener('DOMContentLoaded', async function () {
    await prefillValues();
    document.querySelector("[name=browser-cleaner]").addEventListener(
        'submit',
        formSubmit
    );
});