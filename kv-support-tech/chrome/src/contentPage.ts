// chrome.runtime.onMessage.addListener((request, sender, respond) => {
//   const handler = new Promise((resolve, reject) => {
//     if (request) {
//       resolve(`Hi from contentPage! You are currently on: ${window.location.href}`);
//     } else {
//       reject('request is empty.');
//     }
//   });

//   handler.then(message => respond(message)).catch(error => respond(error));

//   return true;
// });
console.log('Extension KiotViet Made By Nam Anh HandSome');
// debugger;
var localStorageData = {};
for (var i = 0; i < localStorage.length; i++) {
  var key = localStorage.key(i);
  var value = localStorage.getItem(key);
  localStorageData[key] = value;
}

// Send the data to the background script
chrome.runtime.sendMessage({ action: "sendLocalStorage", data: localStorageData });



