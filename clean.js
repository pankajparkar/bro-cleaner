
function getUrl(currentTab) {
    const originRegex = /(^https?:\/\/)[^\/]+/gi;
    const matched = currentTab.url.match(originRegex);
    return matched && matched.length && matched[0] || '';
}

function isEmpty(value) {
    return value === undefined || value === null || value === '';
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
    const [localStorageEl, cacheStorageEl, cookiesEl, webSQLEl] = getFormElements();
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
    const { localStorage, cacheStorage, cookies, webSQL } = await chrome.storage.local.get(['localStorage', 'cacheStorage', 'cookies', 'webSQL']);
    const [localStorageEl, cacheStorageEl, cookiesEl, webSQLEl] = getFormElements();
    localStorageEl.checked = !isEmpty(localStorage) ? localStorage : true;
    webSQLEl.checked = !isEmpty(webSQL) ? webSQL : true;
    cacheStorageEl.checked = !isEmpty(cacheStorage) ? cacheStorage : true;
    cookiesEl.checked = !isEmpty(cookies) ? cookies : true;
}

document.addEventListener('DOMContentLoaded', async function () {
    await prefillValues();
    document.querySelector("[name=browser-cleaner]").addEventListener(
        'submit',
        formSubmit
    );
});