document.addEventListener('DOMContentLoaded', function() {
    const checkButton = document.getElementById('checkButton');
    const urlInput = document.getElementById('urlInput');
    const resultDiv = document.getElementById('result');
    const loading = document.getElementById('loader');

    checkButton.addEventListener('click', function() {
        const url = urlInput.value.trim();
        loading.classList.remove('hide');
        if (url !== '') {
            chrome.runtime.sendMessage({url: url}, function(response) {
                if (response) {
                    resultDiv.textContent = `Detected: ${response.positives}, Total: ${response.total}`;
                    loading.classList.add('hide');
                } else {
                    resultDiv.textContent = 'Failed to get scan results.';
                }
            });
        }
    });
});
