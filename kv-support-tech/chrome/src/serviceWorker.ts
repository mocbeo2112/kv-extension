console.log('serviceWorker script loaded OKE');
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('ok', request, sender, sendResponse)
    if (request.action === "sendLocalStorage") {
      var receivedData = request.data;
  
      // Do something with the received data
      console.log("Received localStorage data from content script:", receivedData);
  
      // You can also save this data to the background script's storage for future use
      chrome.storage.local.set({ "receivedData": receivedData });
    }
  });