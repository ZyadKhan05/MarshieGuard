// background.js

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const api_key = 'YOUR_VIRUSTOTAL_API_KEY'; // Replace with your VirusTotal API key
  const submit_url = 'https://www.virustotal.com/vtapi/v2/url/scan';
  const report_url = 'https://www.virustotal.com/vtapi/v2/url/report';

  if (request.action === "hoverLink") {
    const params = {
      apikey: api_key,
      url: request.url
    };

    // Submit URL for scanning
    fetch(submit_url, {
      method: 'POST',
      body: new URLSearchParams(params),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    .then(response => response.json())
    .then(data => {
      // Wait for a few seconds before checking the report
      setTimeout(() => {
        fetch(`${report_url}?apikey=${api_key}&resource=${data.scan_id}`)
        .then(response => response.json())
        .then(data => {
          // Send response with scan results to popup script
          chrome.runtime.sendMessage({ action: "scanResults", results: { type: "link", ...data } });
        })
        .catch(error => {
          console.error('Error getting link report:', error);
        });
      }, 15000); // Adjust timing as needed
    })
    .catch(error => {
      console.error('Error submitting link:', error);
    });

    return true; // Indicates that the response will be sent asynchronously
  }
});
