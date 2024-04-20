chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'breachedAccount') {
        const hibpApiKey = '2f95a539da0e41b5bea55b6d9052fac2';
        checkBreachedAccount(request.email, hibpApiKey, sendResponse);
    } else if (request.type === 'scanURL') {
        const vtApiKey = 'de6e6f384c68c49d2b1ad391b0c0fb177cd0a36a1b3a6defa0e7bdea1c338fb5'; 
        scanURL(request.url, vtApiKey, sendResponse);
    }
    return true; 
});

function checkBreachedAccount(email, apiKey, sendResponse) {
    const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${email}`;
    const headers = {
        'hibp-api-key': apiKey,
    };

    fetch(url, { headers })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch breaches');
            }
            return response.json();
        })
        .then(breaches => {
            const result = {
                breaches: breaches,
            };
            sendResponse(result);
        })
        .catch(error => {
            console.error('Error:', error);
            sendResponse({ error: 'Error fetching data.' });
        });
}

function scanURL(url, apiKey, sendResponse) {
    const submitUrl = 'https://www.virustotal.com/vtapi/v2/url/scan';
    const reportUrl = 'https://www.virustotal.com/vtapi/v2/url/report';
    const params = {
        apikey: apiKey,
        url: url
    };

    
    fetch(submitUrl, {
        method: 'POST',
        body: new URLSearchParams(params),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
    .then(response => response.json())
    .then(data => {
        
        setTimeout(() => {
            fetch(`${reportUrl}?apikey=${apiKey}&resource=${data.scan_id}`)
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
}
