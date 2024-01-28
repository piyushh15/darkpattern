// popup.js

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('scanButton').addEventListener('click', function () {
    // Send a message to the content script to initiate the scan
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'scan' });
    });
  });

  // Listen for messages from the background script
  // chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //   if (request.action === 'displayFormattedData') {
  //     const element = document.getElementById('formattedData');

  //     // Assuming request.data is an object with pattern information
  //     const patterns = request.data;

  //     // Display the patterns in a column-wise format
  //     //displayPatterns(element, patterns);
     

  //   }
  // });
});

// Function to display patterns in a column-wise format



// function displayPatterns(element, patterns) {
//   element.innerHTML = ''; // Clear previous results

//   const table = document.createElement('table');
//   table.border = '1';

//   // Create header row
//   const headerRow = table.insertRow(0);
//   const patternHeaderCell = headerRow.insertCell(0);
//   patternHeaderCell.innerHTML = '<b>Pattern ID</b>';
//   const presenceHeaderCell = headerRow.insertCell(1);
//   presenceHeaderCell.innerHTML = '<b>Pattern Text</b>';

//   // Create rows for each pattern
//   Object.keys(patterns).forEach((patternKey, index) => {
//     const row = table.insertRow(index + 1);
//     const patternCell = row.insertCell(0);
//     patternCell.innerHTML = patterns[patternKey].id;
//     const presenceCell = row.insertCell(1);
//     presenceCell.innerHTML = patterns[patternKey].text;
//   });

//   element.appendChild(table);
// }

