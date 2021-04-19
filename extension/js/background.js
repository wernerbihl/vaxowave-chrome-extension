var active = false

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript({
    file: 'js/script.js'
  })

  active = active ? false : true
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  sendResponse({state: active})
})