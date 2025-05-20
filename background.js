function openPage() {
  browser.tabs.create({
    url: "./index.html"
  });
}
chrome.browserAction.onClicked.addListener(openPage);
