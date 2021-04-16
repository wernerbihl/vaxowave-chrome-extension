let color = '#3aa757'

chrome.runtime.onInstalled.addListener(() => {
  console.log('INSTALLED')

  chrome.storage.sync.set({ color })
  console.log('Default background color set to %cgreen', `color: ${color}`)
})