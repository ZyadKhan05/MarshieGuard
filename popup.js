document.addEventListener('DOMContentLoaded', function() {
    const checkButton = document.getElementById('checkButton');
    const urlInput = document.getElementById('urlInput');
    const resultDiv = document.getElementById('result');
    const loading = document.getElementById('loader');
    const badImage = document.getElementById('sad'); 

    checkButton.addEventListener('click', function() {
        const url = urlInput.value.trim();
        loading.classList.remove('hide');
        if (url !== '') {
            chrome.runtime.sendMessage({url: url}, function(response) {
                if (response) {
                    resultDiv.textContent = `Detected: ${response.positives}, Total: ${response.total}`;
                    loading.classList.add('hide');
                    if (response.positives > 0) {
                        badImage.style.display = 'block'; 
                    } else {
                        badImage.style.display = 'none'; 
                    }
                } else {
                    resultDiv.textContent = 'Failed to get scan results.';
                    badImage.style.display = 'none'; // Hide the bad image if there's an error
                }
            });
        }
    });
});
