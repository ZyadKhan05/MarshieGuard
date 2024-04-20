chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    const api_key = 'de6e6f384c68c49d2b1ad391b0c0fb177cd0a36a1b3a6defa0e7bdea1c338fb5'; 
    const submit_url = 'https://www.virustotal.com/vtapi/v2/url/scan';
    const report_url = 'https://www.virustotal.com/vtapi/v2/url/report';

    const params = {
        apikey: api_key,
        url: request.url
    };

    
    fetch(submit_url, {
        method: 'POST',
        body: new URLSearchParams(params),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
    .then(response => response.json())
    .then(data => {

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
        }, 15000); 
    })
    .catch(error => {
        console.error('Error submitting URL:', error);
        sendResponse(null);
    });

    return true;
});
