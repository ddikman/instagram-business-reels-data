console.log('background.js loaded')

function scrapeReelStats() {
   // Send a message to the background script
   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs.length === 0) {
      alert('Was not able to interact with the active tab, please check your permissions')
      return
    }
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js'],
    })
  });
}

chrome.action.onClicked.addListener(function(tab) {
  scrapeReelStats()
});