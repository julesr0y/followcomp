chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "setDontFollowMeBack") {
    chrome.storage.local.set({ dontFollowMeBack: message.data });
  }
});