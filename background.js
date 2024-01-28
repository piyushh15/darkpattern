let scannedData;

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'scannedData') {
    scannedData = request.data;

    // Save the data to chrome.storage.local
    chrome.storage.local.set({ 'scannedData': scannedData }, () => {
      console.log('Scanned data saved to storage');
    });

    // Append data and return formatted data
    try {
      const formattedData = await appendData(scannedData);
      console.log('Data formatted successfully');
      const datatodisplay = await predictWithMLModel(formattedData);

      // Save data to file and initiate download
      saveDataToFile(formattedData);
      saveDataToFile(datatodisplay);

      chrome.runtime.sendMessage({ action: 'displayFormattedData', data: formattedData });
    } catch (error) {
      console.error('Error formatting data:', error);
    }
  }
});

async function appendData(data) {
  // Format the data as a string
  const formattedData = data.map(item => {
    return {
      'id': item.id,
      'text': item.text
    }
  });
  // Return the formatted data as a string
  return formattedData;
}

async function predictWithMLModel(data) {
  try {
      const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const apiUrl = 'https://sole-one-antelope.ngrok-free.app/api/predict';

      console.log(JSON.stringify(data));
      

      const response = await fetch(`${corsProxyUrl}${apiUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });


    if (!response.ok) {
      throw new Error(`Failed to fetch ML model API. Status: ${response.status}, ${response.statusText}`);
    }
  
    const mlModelOutput = await response.json();
    console.log('ML Model Output:', mlModelOutput);
    return mlModelOutput;
  } catch (error) {
    console.error('Error sending data to ML model:', error);
    throw error;
  }
}

async function saveDataToFile(data) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Convert blob to data URL and initiate download
    const reader = new FileReader();
    reader.onloadend = function () {
      const dataUrl = reader.result;
      chrome.downloads.download({
        url: dataUrl,
        filename: 'input.json',
        saveAs: false,  // Change to true if you want to prompt user for file name
      }, (downloadId) => {
        console.log('Download initiated with ID:', downloadId);
      });
    };
    reader.readAsDataURL(blob);
  } catch (error) {
    console.error('Error saving data to file:', error);
  }
}
