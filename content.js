chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.action === 'scan') {
    const data = await scrapeData();
    chrome.runtime.sendMessage({ action: 'scannedData', data });
  } else if (request.action === 'displayFormattedData') {
    const data = request.data;
    await highlight(data);
  }
});

async function scrapeData() {
  const elementsWithData = [];

  document.querySelectorAll('[id]').forEach((element) => {
    const id = element.id;
    const text = element.innerText;

    if (text !== undefined) {
      const trimmedText = stripHtmlTags(text.trim());

      if (trimmedText.length > 0 && id.length > 0) {
        elementsWithData.push({ id, text: trimmedText });
      }
    }
  });

  return elementsWithData;
}


async function highlight(data) {
  for (const item of data) {
    const elements = document.querySelectorAll(`[id="${item.id}"]`);

    elements.forEach((element) => {
      element.style.background = 'red';
    });
  }
}

function stripHtmlTags(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const textContent = doc.body.textContent || "";
  const cleanedText = textContent.replace(/\n/g, '').replace(/\t/g, '');
  return cleanedText;
}
