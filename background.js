chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    const api_key = 'de6e6f384c68c49d2b1ad391b0c0fb177cd0a36a1b3a6defa0e7bdea1c338fb5'; // Replace with your VirusTotal API key
    const submit_url = 'https://www.virustotal.com/vtapi/v2/url/scan';
    const report_url = 'https://www.virustotal.com/vtapi/v2/url/report';

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
                sendResponse({
                    positives: data.positives,
                    total: data.total
                });
            })
            .catch(error => {
                console.error('Error getting report:', error);
                sendResponse(null);
            });
        }, 15000); // Adjust timing as needed
    })
    .catch(error => {
        console.error('Error submitting URL:', error);
        sendResponse(null);
    });

    return true; // Indicates that the response will be sent asynchronously
});
