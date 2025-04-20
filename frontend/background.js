chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "explain-selection",
      title: "Ask Study Companion",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "explain-selection") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          const selectedText = window.getSelection().toString();
          chrome.storage.local.set({ selectedText });
        }
      });
    }
  });
  